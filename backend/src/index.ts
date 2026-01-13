import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/db';
import { initDb } from './db/init';
import { keysToCamel, keysToSnake } from './utils/mapper';

dotenv.config();

// Initialize database on startup
(async () => {
    try {
        await initDb();
        console.log('✓ Database initialized successfully');
    } catch (error) {
        console.error('✗ Database initialization failed:', error);
    }
})();

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

// Health check with DB diagnostic
app.get('/api/health', async (req, res) => {
    try {
        const dbCheck = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            database: 'connected',
            time: dbCheck.rows[0].now,
            env: process.env.NODE_ENV
        });
    } catch (error) {
        console.error('❌ Health check DB error:', error);
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Authentication
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const id = `user-${Date.now()}`;
    try {
        await pool.query('INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
            [id, name, email, password, role || 'visitor']);
        res.json({ id, name, email, role: role || 'visitor' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed. Email might already exist.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT id, name, email, role, password FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
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
app.get('/api/animals', async (req, res) => {
    const result = await pool.query('SELECT * FROM animals');
    res.json(keysToCamel(result.rows));
});

app.post('/api/animals', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, species, age, gender, health_status, notes } = data;
    let { cage_id } = data;

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        await pool.query('INSERT INTO animals (id, name, species, age, gender, health_status, cage_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, name, species, age, gender, health_status, cage_id, notes]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding animal:', error);
        res.status(500).json({ error: 'Failed to add animal' });
    }
});

app.put('/api/animals/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { name, species, age, gender, health_status, notes } = data;
    const { id } = req.params;
    let { cage_id } = data;

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        await pool.query(`UPDATE animals SET 
            name = $1, species = $2, age = $3, gender = $4, 
            health_status = $5, cage_id = $6, notes = $7 
            WHERE id = $8`,
            [name, species, age, gender, health_status, cage_id, notes, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ error: 'Failed to update animal' });
    }
});

app.delete('/api/animals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM animals WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({ error: 'Failed to delete animal' });
    }
});

// Cages
app.get('/api/cages', async (req, res) => {
    const result = await pool.query('SELECT * FROM cages');
    res.json(keysToCamel(result.rows));
});

app.post('/api/cages', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, type, capacity, occupancy, location, status } = data;
    try {
        await pool.query('INSERT INTO cages (id, name, type, capacity, occupancy, location, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, name, type, capacity, occupancy || 0, location, status || 'Active']);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding cage:', error);
        res.status(500).json({ error: 'Failed to add cage' });
    }
});

app.put('/api/cages/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { name, type, capacity, occupancy, location, status } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE cages SET 
            name = $1, type = $2, capacity = $3, occupancy = $4, 
            location = $5, status = $6 
            WHERE id = $7`,
            [name, type, capacity, occupancy, location, status, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating cage:', error);
        res.status(500).json({ error: 'Failed to update cage' });
    }
});

app.delete('/api/cages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cages WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting cage:', error);
        res.status(500).json({ error: 'Failed to delete cage' });
    }
});

// Employees
app.get('/api/employees', async (req, res) => {
    const result = await pool.query('SELECT * FROM employees');
    res.json(keysToCamel(result.rows));
});

app.post('/api/employees', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, role, phone, salary, join_date, status } = data;
    try {
        await pool.query('INSERT INTO employees (id, name, email, role, phone, salary, join_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, name, email, role, phone, salary, join_date, status || 'Active']);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { name, email, role, phone, salary, join_date, status } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE employees SET 
            name = $1, email = $2, role = $3, phone = $4, 
            salary = $5, join_date = $6, status = $7 
            WHERE id = $8`,
            [name, email, role, phone, salary, join_date, status, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Doctors
app.get('/api/doctors', async (req, res) => {
    const result = await pool.query('SELECT * FROM doctors');
    res.json(keysToCamel(result.rows));
});

app.post('/api/doctors', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, specialization, email, phone, availability, experience } = data;
    try {
        await pool.query('INSERT INTO doctors (id, name, specialization, email, phone, availability, experience) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, name, specialization, email, phone, availability || 'Available', experience]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor' });
    }
});

app.put('/api/doctors/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { name, specialization, email, phone, availability, experience } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE doctors SET 
            name = $1, specialization = $2, email = $3, phone = $4, 
            availability = $5, experience = $6 
            WHERE id = $7`,
            [name, specialization, email, phone, availability, experience, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Failed to update doctor' });
    }
});

app.delete('/api/doctors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});

// Events
app.get('/api/events', async (req, res) => {
    const result = await pool.query('SELECT * FROM events');
    res.json(keysToCamel(result.rows));
});

app.post('/api/events', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, title, description, date, time, location, capacity, registered_count, status } = data;
    try {
        await pool.query('INSERT INTO events (id, title, description, date, time, location, capacity, registered_count, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [id, title, description, date, time, location, capacity, registered_count || 0, status || 'Upcoming']);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
});

app.put('/api/events/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { title, description, date, time, location, capacity, registered_count, status } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE events SET 
            title = $1, description = $2, date = $3, time = $4, 
            location = $5, capacity = $6, registered_count = $7, status = $8 
            WHERE id = $9`,
            [title, description, date, time, location, capacity, registered_count, status, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Tickets
app.get('/api/tickets', async (req, res) => {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(keysToCamel(result.rows));
});

app.post('/api/tickets', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, type, price, description, start_date, discount_percentage } = data;
    try {
        await pool.query('INSERT INTO tickets (id, type, price, description, start_date, discount_percentage) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, type || 'Standard', price, description || '', start_date || new Date().toISOString().split('T')[0], discount_percentage || 0]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding ticket:', error);
        res.status(500).json({ error: 'Failed to add ticket' });
    }
});

app.put('/api/tickets/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { type, price, description, start_date, discount_percentage } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE tickets SET 
            type = $1, price = $2, description = $3, 
            start_date = $4, discount_percentage = $5 
            WHERE id = $6`,
            [type, price, description, start_date, discount_percentage, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

// Ticket Sales
app.get('/api/ticket-sales', async (req, res) => {
    const result = await pool.query('SELECT * FROM ticket_sales');
    res.json(keysToCamel(result.rows));
});

app.post('/api/ticket-sales', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone } = data;
    try {
        await pool.query(`
            INSERT INTO ticket_sales (id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            id || `sale-${Date.now()}`,
            ticket_id,
            quantity,
            total_amount,
            date || new Date().toISOString().split('T')[0],
            visitor_name,
            visitor_email,
            visitor_phone
        ]);

        // Upsert visitor information too
        if (visitor_email) {
            const visitorId = `visitor-${Date.now()}`;
            const checkVisitorResult = await pool.query('SELECT id FROM visitors WHERE email = $1', [visitor_email]);
            const checkVisitor = checkVisitorResult.rows[0];
            if (checkVisitor) {
                await pool.query('UPDATE visitors SET name = $1, phone = $2 WHERE id = $3',
                    [visitor_name, visitor_phone, checkVisitor.id]);
            } else {
                await pool.query('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES ($1, $2, $3, $4, $5)',
                    [visitorId, visitor_name, visitor_email, visitor_phone, new Date().toISOString().split('T')[0]]);
            }
        }

        res.json(req.body);
    } catch (error) {
        console.error('Error adding ticket sale:', error);
        res.status(500).json({ error: 'Failed to add ticket sale' });
    }
});

// Inventory
app.get('/api/inventory', async (req, res) => {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(keysToCamel(result.rows));
});

app.post('/api/inventory', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    try {
        await pool.query('INSERT INTO inventory (id, name, category, quantity, unit, min_threshold, expiry_date, supplier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, name, category, quantity, unit, min_threshold, expiry_date, supplier]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE inventory SET 
            name = $1, category = $2, quantity = $3, unit = $4, 
            min_threshold = $5, expiry_date = $6, supplier = $7 
            WHERE id = $8`,
            [name, category, quantity, unit, min_threshold, expiry_date, supplier, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM inventory WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

// Visitors
app.get('/api/visitors', async (req, res) => {
    const result = await pool.query('SELECT * FROM visitors');
    res.json(keysToCamel(result.rows));
});

app.post('/api/visitors', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, phone, registration_date } = data;
    try {
        await pool.query('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES ($1, $2, $3, $4, $5)',
            [id, name, email, phone, registration_date || new Date().toISOString().split('T')[0]]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding visitor:', error);
        res.status(500).json({ error: 'Failed to add visitor' });
    }
});

// Medical Checks
app.get('/api/medical-checks', async (req, res) => {
    const result = await pool.query('SELECT * FROM medical_checks');
    res.json(keysToCamel(result.rows));
});

app.post('/api/medical-checks', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    try {
        await pool.query('INSERT INTO medical_checks (id, animal_id, doctor_id, date, diagnosis, treatment, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, animal_id, doctor_id, date, diagnosis, treatment, status || 'Completed', notes]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding medical check:', error);
        res.status(500).json({ error: 'Failed to add medical check' });
    }
});

app.put('/api/medical-checks/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE medical_checks SET 
            animal_id = $1, doctor_id = $2, date = $3, diagnosis = $4, 
            treatment = $5, status = $6, notes = $7 
            WHERE id = $8`,
            [animal_id, doctor_id, date, diagnosis, treatment, status, notes, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating medical check:', error);
        res.status(500).json({ error: 'Failed to update medical check' });
    }
});

app.delete('/api/medical-checks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM medical_checks WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting medical check:', error);
        res.status(500).json({ error: 'Failed to delete medical check' });
    }
});

// Vaccinations
app.get('/api/vaccinations', async (req, res) => {
    const result = await pool.query('SELECT * FROM vaccinations');
    res.json(keysToCamel(result.rows));
});

app.post('/api/vaccinations', async (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    try {
        await pool.query('INSERT INTO vaccinations (id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding vaccination:', error);
        res.status(500).json({ error: 'Failed to add vaccination' });
    }
});

app.put('/api/vaccinations/:id', async (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    const { id } = req.params;
    try {
        await pool.query(`UPDATE vaccinations SET 
            animal_id = $1, vaccine_name = $2, date_administered = $3, 
            next_due_date = $4, veterinarian = $5, notes = $6 
            WHERE id = $7`,
            [animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes, id]);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating vaccination:', error);
        res.status(500).json({ error: 'Failed to update vaccination' });
    }
});

app.delete('/api/vaccinations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM vaccinations WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting vaccination:', error);
        res.status(500).json({ error: 'Failed to delete vaccination' });
    }
});

// Zoo Info
app.get('/api/zoo-info', async (req, res) => {
    const result = await pool.query('SELECT * FROM zoo_info LIMIT 1');
    res.json(keysToCamel(result.rows[0]));
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const animalResult = await pool.query('SELECT COUNT(*) as count FROM animals');
        const employeeResult = await pool.query('SELECT COUNT(*) as count FROM employees');
        const cageResult = await pool.query('SELECT COUNT(*) as count FROM cages');
        const salesResult = await pool.query('SELECT SUM(total_amount) as total FROM ticket_sales');

        res.json({
            animals: parseInt(animalResult.rows[0].count),
            employees: parseInt(employeeResult.rows[0].count),
            cages: parseInt(cageResult.rows[0].count),
            revenue: parseFloat(salesResult.rows[0].total) || 0
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
