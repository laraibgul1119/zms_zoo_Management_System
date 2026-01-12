import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/db';
import { initDb } from './db/init';
import { keysToCamel, keysToSnake } from './utils/mapper';

dotenv.config();

// Initialize database on startup
try {
    initDb();
    console.log('✓ Database initialized successfully');
} catch (error) {
    console.error('✗ Database initialization failed:', error);
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Authentication
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const id = `user-${Date.now()}`;
    try {
        db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
            .run(id, name, email, password, role || 'visitor');
        res.json({ id, name, email, role: role || 'visitor' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed. Email might already exist.' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    try {
        const user = db.prepare('SELECT id, name, email, role, password FROM users WHERE email = ?').get(email) as any;
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            res.json(keysToCamel(userWithoutPassword));
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Animals
app.get('/api/animals', (req, res) => {
    const animals = db.prepare('SELECT * FROM animals').all();
    res.json(keysToCamel(animals));
});

app.post('/api/animals', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, species, age, gender, health_status, notes } = data;
    let { cage_id } = data;

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        db.prepare('INSERT INTO animals (id, name, species, age, gender, health_status, cage_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, species, age, gender, health_status, cage_id, notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding animal:', error);
        res.status(500).json({ error: 'Failed to add animal' });
    }
});

app.put('/api/animals/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, species, age, gender, health_status, notes } = data;
    const { id } = req.params;
    let { cage_id } = data;

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        db.prepare(`UPDATE animals SET 
            name = ?, species = ?, age = ?, gender = ?, 
            health_status = ?, cage_id = ?, notes = ? 
            WHERE id = ?`)
            .run(name, species, age, gender, health_status, cage_id, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ error: 'Failed to update animal' });
    }
});

app.delete('/api/animals/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM animals WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({ error: 'Failed to delete animal' });
    }
});

// Cages
app.get('/api/cages', (req, res) => {
    const cages = db.prepare('SELECT * FROM cages').all();
    res.json(keysToCamel(cages));
});

app.post('/api/cages', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, type, capacity, occupancy, location, status } = data;
    try {
        db.prepare('INSERT INTO cages (id, name, type, capacity, occupancy, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, type, capacity, occupancy || 0, location, status || 'Active');
        res.json(req.body);
    } catch (error) {
        console.error('Error adding cage:', error);
        res.status(500).json({ error: 'Failed to add cage' });
    }
});

app.put('/api/cages/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, type, capacity, occupancy, location, status } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE cages SET 
            name = ?, type = ?, capacity = ?, occupancy = ?, 
            location = ?, status = ? 
            WHERE id = ?`)
            .run(name, type, capacity, occupancy, location, status, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating cage:', error);
        res.status(500).json({ error: 'Failed to update cage' });
    }
});

app.delete('/api/cages/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM cages WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting cage:', error);
        res.status(500).json({ error: 'Failed to delete cage' });
    }
});

// Employees
app.get('/api/employees', (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(keysToCamel(employees));
});

app.post('/api/employees', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, role, phone, salary, join_date, status } = data;
    try {
        db.prepare('INSERT INTO employees (id, name, email, role, phone, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, email, role, phone, salary, join_date, status || 'Active');
        res.json(req.body);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

app.put('/api/employees/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, email, role, phone, salary, join_date, status } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE employees SET 
            name = ?, email = ?, role = ?, phone = ?, 
            salary = ?, join_date = ?, status = ? 
            WHERE id = ?`)
            .run(name, email, role, phone, salary, join_date, status, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM employees WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Doctors
app.get('/api/doctors', (req, res) => {
    const doctors = db.prepare('SELECT * FROM doctors').all();
    res.json(keysToCamel(doctors));
});

app.post('/api/doctors', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, specialization, email, phone, availability, experience } = data;
    try {
        db.prepare('INSERT INTO doctors (id, name, specialization, email, phone, availability, experience) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, specialization, email, phone, availability || 'Available', experience);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor' });
    }
});

app.put('/api/doctors/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, specialization, email, phone, availability, experience } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE doctors SET 
            name = ?, specialization = ?, email = ?, phone = ?, 
            availability = ?, experience = ? 
            WHERE id = ?`)
            .run(name, specialization, email, phone, availability, experience, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Failed to update doctor' });
    }
});

app.delete('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM doctors WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});

// Events
app.get('/api/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events').all();
    res.json(keysToCamel(events));
});

app.post('/api/events', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, title, description, date, time, location, capacity, registered_count, status } = data;
    try {
        db.prepare('INSERT INTO events (id, title, description, date, time, location, capacity, registered_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, title, description, date, time, location, capacity, registered_count || 0, status || 'Upcoming');
        res.json(req.body);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
});

app.put('/api/events/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { title, description, date, time, location, capacity, registered_count, status } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE events SET 
            title = ?, description = ?, date = ?, time = ?, 
            location = ?, capacity = ?, registered_count = ?, status = ? 
            WHERE id = ?`)
            .run(title, description, date, time, location, capacity, registered_count, status, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM events WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Tickets
app.get('/api/tickets', (req, res) => {
    const tickets = db.prepare('SELECT * FROM tickets').all();
    res.json(keysToCamel(tickets));
});

app.post('/api/tickets', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, type, price, description, start_date, discount_percentage } = data;
    try {
        db.prepare('INSERT INTO tickets (id, type, price, description, start_date, discount_percentage) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, type || 'Standard', price, description || '', start_date || new Date().toISOString().split('T')[0], discount_percentage || 0);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding ticket:', error);
        res.status(500).json({ error: 'Failed to add ticket' });
    }
});

app.put('/api/tickets/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { type, price, description, start_date, discount_percentage } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE tickets SET 
            type = ?, price = ?, description = ?, 
            start_date = ?, discount_percentage = ? 
            WHERE id = ?`)
            .run(type, price, description, start_date, discount_percentage, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.delete('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

// Ticket Sales
app.get('/api/ticket-sales', (req, res) => {
    const sales = db.prepare('SELECT * FROM ticket_sales').all();
    res.json(keysToCamel(sales));
});

app.post('/api/ticket-sales', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone } = data;
    try {
        // Start transaction
        const insertSale = db.prepare(`
            INSERT INTO ticket_sales (id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertSale.run(
            id || `sale-${Date.now()}`,
            ticket_id,
            quantity,
            total_amount,
            date || new Date().toISOString().split('T')[0],
            visitor_name,
            visitor_email,
            visitor_phone
        );

        // Upsert visitor information too
        if (visitor_email) {
            const visitorId = `visitor-${Date.now()}`;
            const checkVisitor = db.prepare('SELECT id FROM visitors WHERE email = ?').get() as { id: string } | undefined;
            if (checkVisitor) {
                db.prepare('UPDATE visitors SET name = ?, phone = ? WHERE id = ?')
                    .run(visitor_name, visitor_phone, checkVisitor.id);
            } else {
                db.prepare('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES (?, ?, ?, ?, ?)')
                    .run(visitorId, visitor_name, visitor_email, visitor_phone, new Date().toISOString().split('T')[0]);
            }
        }

        res.json(req.body);
    } catch (error) {
        console.error('Error adding ticket sale:', error);
        res.status(500).json({ error: 'Failed to add ticket sale' });
    }
});

// Visitors
app.get('/api/visitors', (req, res) => {
    const visitors = db.prepare('SELECT * FROM visitors').all();
    res.json(keysToCamel(visitors));
});

app.post('/api/visitors', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, phone, registration_date } = data;
    try {
        db.prepare('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES (?, ?, ?, ?, ?)')
            .run(id, name, email, phone, registration_date || new Date().toISOString().split('T')[0]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding visitor:', error);
        res.status(500).json({ error: 'Failed to add visitor' });
    }
});

// Inventory
app.get('/api/inventory', (req, res) => {
    const inventory = db.prepare('SELECT * FROM inventory').all();
    res.json(keysToCamel(inventory));
});

app.post('/api/inventory', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    try {
        db.prepare('INSERT INTO inventory (id, name, category, quantity, unit, min_threshold, expiry_date, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, category, quantity, unit, min_threshold, expiry_date, supplier);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

app.put('/api/inventory/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE inventory SET 
            name = ?, category = ?, quantity = ?, unit = ?, 
            min_threshold = ?, expiry_date = ?, supplier = ? 
            WHERE id = ?`)
            .run(name, category, quantity, unit, min_threshold, expiry_date, supplier, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

// Medical Checks
app.get('/api/medical-checks', (req, res) => {
    const checks = db.prepare('SELECT * FROM medical_checks').all();
    res.json(keysToCamel(checks));
});

app.post('/api/medical-checks', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    try {
        db.prepare('INSERT INTO medical_checks (id, animal_id, doctor_id, date, diagnosis, treatment, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, animal_id, doctor_id, date, diagnosis, treatment, status || 'Completed', notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding medical check:', error);
        res.status(500).json({ error: 'Failed to add medical check' });
    }
});

app.put('/api/medical-checks/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE medical_checks SET 
            animal_id = ?, doctor_id = ?, date = ?, diagnosis = ?, 
            treatment = ?, status = ?, notes = ? 
            WHERE id = ?`)
            .run(animal_id, doctor_id, date, diagnosis, treatment, status, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating medical check:', error);
        res.status(500).json({ error: 'Failed to update medical check' });
    }
});

app.delete('/api/medical-checks/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM medical_checks WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting medical check:', error);
        res.status(500).json({ error: 'Failed to delete medical check' });
    }
});

// Vaccinations
app.get('/api/vaccinations', (req, res) => {
    const vaccinations = db.prepare('SELECT * FROM vaccinations').all();
    res.json(keysToCamel(vaccinations));
});

app.post('/api/vaccinations', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    try {
        db.prepare('INSERT INTO vaccinations (id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding vaccination:', error);
        res.status(500).json({ error: 'Failed to add vaccination' });
    }
});

app.put('/api/vaccinations/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE vaccinations SET 
            animal_id = ?, vaccine_name = ?, date_administered = ?, 
            next_due_date = ?, veterinarian = ?, notes = ? 
            WHERE id = ?`)
            .run(animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating vaccination:', error);
        res.status(500).json({ error: 'Failed to update vaccination' });
    }
});

app.delete('/api/vaccinations/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM vaccinations WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting vaccination:', error);
        res.status(500).json({ error: 'Failed to delete vaccination' });
    }
});

// Zoo Info
app.get('/api/zoo-info', (req, res) => {
    const info = db.prepare('SELECT * FROM zoo_info LIMIT 1').get();
    res.json(keysToCamel(info));
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
    const animalCount = db.prepare('SELECT COUNT(*) as count FROM animals').get() as { count: number };
    const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
    const cageCount = db.prepare('SELECT COUNT(*) as count FROM cages').get() as { count: number };
    const ticketSales = db.prepare('SELECT SUM(total_amount) as total FROM ticket_sales').get() as { total: number };

    res.json({
        animals: animalCount.count,
        employees: employeeCount.count,
        cages: cageCount.count,
        revenue: ticketSales.total || 0
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
