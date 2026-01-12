#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from datetime import datetime
import os

# Create PDF
pdf_path = "ZMS_Complete_Documentation.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                        rightMargin=0.75*inch, leftMargin=0.75*inch,
                        topMargin=0.75*inch, bottomMargin=0.75*inch)

# Container for PDF elements
elements = []

# Define styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=28,
    textColor=colors.HexColor('#1F2937'),
    spaceAfter=30,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=16,
    textColor=colors.HexColor('#374151'),
    spaceAfter=12,
    spaceBefore=12,
    fontName='Helvetica-Bold',
    borderColor=colors.HexColor('#3B82F6'),
    borderWidth=2,
    borderPadding=10,
    backColor=colors.HexColor('#EFF6FF')
)

subheading_style = ParagraphStyle(
    'CustomSubHeading',
    parent=styles['Heading3'],
    fontSize=13,
    textColor=colors.HexColor('#1F2937'),
    spaceAfter=10,
    spaceBefore=10,
    fontName='Helvetica-Bold'
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['BodyText'],
    fontSize=11,
    textColor=colors.HexColor('#374151'),
    spaceAfter=12,
    alignment=TA_JUSTIFY,
    leading=14
)

code_style = ParagraphStyle(
    'CustomCode',
    parent=styles['BodyText'],
    fontSize=9,
    textColor=colors.HexColor('#1F2937'),
    spaceAfter=10,
    fontName='Courier',
    leftIndent=20,
    backColor=colors.HexColor('#F3F4F6'),
    borderColor=colors.HexColor('#D1D5DB'),
    borderWidth=1,
    borderPadding=8
)

# Title Page
elements.append(Spacer(1, 2*inch))
elements.append(Paragraph("Zoo Management System (ZMS)", title_style))
elements.append(Spacer(1, 0.3*inch))
elements.append(Paragraph("مکمل تکنیکی ڈاکومنٹیشن", title_style))
elements.append(Spacer(1, 0.5*inch))
elements.append(Paragraph("Document Date: {}".format(datetime.now().strftime('%d-%m-%Y')), body_style))
elements.append(Spacer(1, 0.3*inch))
elements.append(Paragraph("Complete Technical Documentation for Zoo Management System including Frontend, Backend, Database Architecture and Communication Flow.", body_style))

elements.append(PageBreak())

# Table of Contents
elements.append(Paragraph("Table of Contents", heading_style))
elements.append(Spacer(1, 0.2*inch))

toc_content = """
1. Project Overview<br/>
2. Technology Stack<br/>
3. Project Architecture<br/>
4. Database Design<br/>
5. Backend API Endpoints<br/>
6. Frontend Structure<br/>
7. Frontend and Backend Communication<br/>
8. User Flows<br/>
9. Security<br/>
10. Conclusion
"""
elements.append(Paragraph(toc_content, body_style))
elements.append(PageBreak())

# 1. Project Overview
elements.append(Paragraph("1. PROJECT OVERVIEW", heading_style))
elements.append(Spacer(1, 0.15*inch))
elements.append(Paragraph("""
Zoo Management System (ZMS) is a comprehensive web application designed to manage all operations of a zoo. It handles animal records, employee management, veterinary care, ticket sales, visitor information, and inventory management. The system serves multiple user types including zoo staff, veterinarians, and public visitors.
<br/><br/>
<b>Key Features:</b><br/>
• Complete animal record management<br/>
• Cage planning and allocation<br/>
• Employee and veterinarian management<br/>
• Medical checkups and vaccinations<br/>
• Ticket sales and visitor tracking<br/>
• Inventory management<br/>
• Event planning and management
""", body_style))
elements.append(Spacer(1, 0.2*inch))

# 2. Technology Stack
elements.append(Paragraph("2. TECHNOLOGY STACK", heading_style))
elements.append(Spacer(1, 0.15*inch))

tech_data = [
    ['Layer', 'Technology', 'Version & Details'],
    ['Frontend Framework', 'React', '18.3.1 with JSX'],
    ['Frontend Language', 'TypeScript', '5.5.4'],
    ['Routing', 'React Router', '6.26.2'],
    ['Styling', 'Tailwind CSS', '3.4.17'],
    ['Build Tool', 'Vite', '5.2.0'],
    ['Backend Framework', 'Express.js', '4.21.1'],
    ['Backend Runtime', 'Node.js', 'CommonJS'],
    ['Database', 'SQLite', 'better-sqlite3 11.5.0'],
    ['Backend Language', 'TypeScript', '5.5.4'],
    ['CORS Handling', 'cors package', '2.8.5'],
    ['Icons Library', 'lucide-react', '0.522.0'],
]

tech_table = Table(tech_data, colWidths=[1.8*inch, 1.8*inch, 2.2*inch])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3B82F6')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F9FAFB')),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
]))
elements.append(tech_table)
elements.append(Spacer(1, 0.2*inch))

# 3. Project Architecture
elements.append(Paragraph("3. PROJECT ARCHITECTURE", heading_style))
elements.append(Spacer(1, 0.15*inch))
elements.append(Paragraph("""
<b>Directory Structure:</b>
""", subheading_style))

arch_text = """
zms/ (Root Directory)<br/>
├── src/ (Frontend)<br/>
│   ├── components/ (UI Components)<br/>
│   │   └── ui/ (Basic UI Components)<br/>
│   ├── pages/ (Pages)<br/>
│   │   ├── public/ (Public Pages)<br/>
│   │   └── staff/ (Staff Pages)<br/>
│   ├── contexts/ (React Context State)<br/>
│   ├── utils/ (Utility Functions)<br/>
│   └── types/ (TypeScript Types)<br/>
├── backend/src/ (Backend)<br/>
│   ├── db/ (Database Setup)<br/>
│   ├── routes/ (API Routes)<br/>
│   ├── services/ (Business Logic)<br/>
│   ├── utils/ (Utilities)<br/>
│   └── types/ (Type Definitions)<br/>
├── public/ (Static Assets)<br/>
└── Configuration Files (package.json, tsconfig.json, etc.)
"""
elements.append(Paragraph(arch_text, body_style))
elements.append(Spacer(1, 0.2*inch))

# 4. Database Design
elements.append(Paragraph("4. DATABASE DESIGN", heading_style))
elements.append(Spacer(1, 0.15*inch))
elements.append(Paragraph("Database is SQLite with Foreign Key constraints enabled for data integrity.", subheading_style))
elements.append(Spacer(1, 0.1*inch))

db_tables = [
    ['Table Name', 'Purpose', 'Key Columns'],
    ['users', 'User authentication', 'id, name, email, password, role'],
    ['animals', 'Animal records', 'id, name, species, age, gender, health_status, cage_id'],
    ['cages', 'Cage information', 'id, name, type, capacity, occupancy, location, status'],
    ['employees', 'Employee records', 'id, name, email, role, phone, salary, join_date'],
    ['doctors', 'Veterinarian info', 'id, name, specialization, email, phone, availability'],
    ['medical_checks', 'Medical checkups', 'id, animal_id, doctor_id, date, diagnosis, treatment'],
    ['vaccinations', 'Vaccination records', 'id, animal_id, vaccine_name, date_administered, next_due_date'],
    ['events', 'Event management', 'id, title, description, date, time, location, capacity'],
    ['tickets', 'Ticket types', 'id, type, price, description'],
    ['ticket_sales', 'Sales records', 'id, ticket_id, quantity, total_amount, date, visitor_name'],
    ['visitors', 'Visitor info', 'id, name, email, phone, registration_date'],
    ['inventory', 'Inventory items', 'id, name, category, quantity, unit, min_threshold, expiry_date'],
]

db_table = Table(db_tables, colWidths=[1.3*inch, 1.7*inch, 2.8*inch])
db_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10B981')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 9),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F0FDF4')),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#D1FAE5')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F0FDF4')]),
    ('FONTSIZE', (0, 1), (-1, -1), 8),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
elements.append(db_table)
elements.append(Spacer(1, 0.2*inch))

elements.append(PageBreak())

# 5. Backend API Endpoints
elements.append(Paragraph("5. BACKEND API ENDPOINTS", heading_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("A. Authentication Endpoints", subheading_style))
api_auth_data = [
    ['Method', 'Endpoint', 'Purpose'],
    ['POST', '/api/auth/register', 'Register new user'],
    ['POST', '/api/auth/login', 'User login'],
]
auth_table = Table(api_auth_data, colWidths=[0.9*inch, 2.3*inch, 2.3*inch])
auth_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7C3AED')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 10),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#DDD6FE')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#FAF5FF')]),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
]))
elements.append(auth_table)
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("B. Animal Endpoints", subheading_style))
api_animals_data = [
    ['GET', '/api/animals', 'Get all animals'],
    ['POST', '/api/animals', 'Add new animal'],
    ['PUT', '/api/animals/:id', 'Update animal'],
    ['DELETE', '/api/animals/:id', 'Delete animal'],
]
animals_table = Table(api_animals_data, colWidths=[0.9*inch, 2.3*inch, 2.3*inch])
animals_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F59E0B')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#FED7AA')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#FFFBEB')]),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
]))
elements.append(animals_table)
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("C. Other Core Endpoints", subheading_style))
other_endpoints = """
<b>Cages:</b> GET /api/cages, POST /api/cages, PUT /api/cages/:id, DELETE /api/cages/:id<br/>
<b>Employees:</b> GET /api/employees, POST /api/employees, PUT /api/employees/:id, DELETE /api/employees/:id<br/>
<b>Doctors:</b> GET /api/doctors, POST /api/doctors, PUT /api/doctors/:id, DELETE /api/doctors/:id<br/>
<b>Vaccinations:</b> GET /api/vaccinations, POST /api/vaccinations, PUT /api/vaccinations/:id, DELETE /api/vaccinations/:id<br/>
<b>Medical Checks:</b> GET /api/medical-checks, POST /api/medical-checks, PUT /api/medical-checks/:id, DELETE /api/medical-checks/:id<br/>
<b>Events:</b> GET /api/events, POST /api/events, PUT /api/events/:id, DELETE /api/events/:id<br/>
<b>Tickets:</b> GET /api/tickets, POST /api/tickets, PUT /api/tickets/:id, DELETE /api/tickets/:id<br/>
<b>Ticket Sales:</b> GET /api/ticket-sales, POST /api/ticket-sales<br/>
<b>Visitors:</b> GET /api/visitors, POST /api/visitors<br/>
<b>Inventory:</b> GET /api/inventory, POST /api/inventory, PUT /api/inventory/:id, DELETE /api/inventory/:id<br/>
<b>Health Check:</b> GET /api/health
"""
elements.append(Paragraph(other_endpoints, body_style))

elements.append(PageBreak())

# 6. Frontend Structure
elements.append(Paragraph("6. FRONTEND STRUCTURE", heading_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("A. Main Pages", subheading_style))
pages_text = """
<b>Public Pages:</b><br/>
• LandingPage - Main zoo homepage<br/>
• RegisterPage - New user registration<br/>
• LoginPage - User login<br/>
• EventsPage - Events listing<br/>
• TicketPurchasePage - Ticket booking<br/>
<br/>
<b>Staff Pages (Protected):</b><br/>
• DashboardPage - Staff dashboard<br/>
• AnimalsPage - Animal management<br/>
• CagesPage - Cage management<br/>
• EmployeesPage - Employee management<br/>
• DoctorsPage - Veterinarian management<br/>
• MedicalChecksPage - Medical records<br/>
• VaccinationsPage - Vaccination records<br/>
• SalariesPage - Salary management<br/>
• InventoryPage - Inventory management<br/>
• TicketSalesPage - Sales tracking<br/>
• EventManagementPage - Event management<br/>
• VisitorsPage - Visitor records
"""
elements.append(Paragraph(pages_text, body_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("B. UI Components", subheading_style))
components_text = """
<b>Basic Components:</b> Button, Input, Select, Modal, Table, Card, Badge, StatCard, Navbar, FeatureCard<br/>
<b>Special Components:</b> ProtectedRoute (for access control), AnimalShape (custom SVG)
"""
elements.append(Paragraph(components_text, body_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("C. State Management", subheading_style))
state_text = """
<b>AuthContext:</b> Manages user authentication state globally. Provides user information, login/logout functions to all components. Enables ProtectedRoute to restrict access.
"""
elements.append(Paragraph(state_text, body_style))

elements.append(PageBreak())

# 7. Frontend and Backend Communication
elements.append(Paragraph("7. FRONTEND AND BACKEND COMMUNICATION", heading_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("Communication Protocol", subheading_style))
comm_text = """
Frontend communicates with Backend via HTTP REST API. The api.ts utility file contains all API functions. Communication flow:

1. User interacts with React component
2. Component calls api function (e.g., api.getAnimals())
3. HTTP request sent to Backend (GET http://localhost:3001/api/animals)
4. Express server receives and processes request
5. Backend queries SQLite database
6. Response sent back as JSON
7. Frontend receives and displays data

Base URL: http://localhost:3001/api
Default Port: 3001 (configurable via PORT env variable)
"""
elements.append(Paragraph(comm_text, body_style))
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("Data Flow Example - Getting Animals", subheading_style))
flow_example = """
Frontend Request:
fetch('http://localhost:3001/api/animals', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})

Backend Handler:
app.get('/api/animals', (req, res) => {
  const animals = db.prepare('SELECT * FROM animals').all();
  res.json(keysToCamel(animals));
});

Response:
[
  { id: 'ani-1', name: 'Leo', species: 'Lion', ... },
  { id: 'ani-2', name: 'Ella', species: 'Elephant', ... }
]
"""
elements.append(Paragraph(flow_example, code_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("CORS and Middleware", subheading_style))
cors_text = """
Backend enables CORS to allow cross-origin requests from frontend. Middleware components:
• cors() - Enables cross-origin requests
• express.json() - Parses JSON request bodies
• Request logger - Logs all incoming requests
• Error handlers - Returns appropriate error responses

Data Mapping:
Frontend uses camelCase (firstName), Database uses snake_case (first_name). 
mapper.ts utility converts between formats automatically.
"""
elements.append(Paragraph(cors_text, body_style))

elements.append(PageBreak())

# 8. User Flows
elements.append(Paragraph("8. USER FLOWS", heading_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("Flow 1: User Registration", subheading_style))
flow1_text = """
1. User opens RegisterPage
2. Enters name, email, password, and role
3. Clicks submit button
4. Frontend calls api.register(userData)
5. POST request sent to /api/auth/register
6. Backend validates and inserts user into database
7. Success response returned
8. User redirected to login page
"""
elements.append(Paragraph(flow1_text, body_style))
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("Flow 2: User Login", subheading_style))
flow2_text = """
1. User opens LoginPage
2. Enters email and password
3. Clicks login button
4. Frontend calls api.login(credentials)
5. POST request sent to /api/auth/login
6. Backend queries database and verifies credentials
7. If valid, returns user data (without password)
8. Frontend stores in AuthContext
9. User redirected to dashboard
"""
elements.append(Paragraph(flow2_text, body_style))
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("Flow 3: Adding Animal", subheading_style))
flow3_text = """
1. Staff opens AnimalsPage
2. Clicks "Add Animal" button
3. Modal opens with form
4. Staff fills animal details
5. Clicks save
6. Frontend calls api.createAnimal(data)
7. POST request sent to /api/animals
8. Backend generates ID and inserts record
9. Cage occupancy updated
10. Response returns new animal
11. Frontend adds to list and refreshes display
"""
elements.append(Paragraph(flow3_text, body_style))
elements.append(Spacer(1, 0.1*inch))

elements.append(Paragraph("Flow 4: Ticket Purchase", subheading_style))
flow4_text = """
1. Visitor opens TicketPurchasePage
2. Selects ticket type and quantity
3. Enters personal information
4. Clicks purchase
5. Frontend calls api.createTicketSale(data)
6. POST request sent to /api/ticket-sales
7. Backend creates sales record
8. Generates receipt
9. Response returns confirmation
10. Frontend displays confirmation with details
"""
elements.append(Paragraph(flow4_text, body_style))

elements.append(PageBreak())

# 9. Security
elements.append(Paragraph("9. SECURITY MEASURES", heading_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("Current Security Features", subheading_style))
security_text = """
✓ Role-based Access Control (RBAC) - Different users have different permissions
✓ ProtectedRoute Component - Restricts unauthorized access to staff pages
✓ CORS Configuration - Controls which origins can access API
✓ SQLite Foreign Keys - Maintains data referential integrity
✓ Input validation - Basic validation through frontend
✓ HTTP Methods - Proper use of GET, POST, PUT, DELETE
✓ Error handling - Server returns appropriate error codes
"""
elements.append(Paragraph(security_text, body_style))
elements.append(Spacer(1, 0.15*inch))

elements.append(Paragraph("Recommended Security Improvements", subheading_style))
improvement_text = """
⚠️ CRITICAL IMPROVEMENTS NEEDED:

1. PASSWORD HASHING: Use bcrypt instead of plain-text passwords
   - Current: password stored as plain text
   - Recommended: Use bcrypt with salt rounds

2. AUTHENTICATION TOKENS: Implement JWT (JSON Web Tokens)
   - Current: No session/token system
   - Recommended: JWT for stateless authentication

3. HTTPS/SSL: Use HTTPS in production
   - Current: HTTP only
   - Recommended: Force HTTPS, use certificates

4. INPUT VALIDATION: Validate all inputs on server
   - Current: Minimal validation
   - Recommended: Schema validation (joi, zod)

5. RATE LIMITING: Prevent brute force attacks
   - Current: None
   - Recommended: Implement rate limiting middleware

6. SQL INJECTION PREVENTION: Already using prepared statements (good!)
   - Continue using parameterized queries

7. ENVIRONMENT VARIABLES: Protect sensitive data
   - Current: Some config hardcoded
   - Recommended: All secrets in .env file

8. AUDIT LOGGING: Track all data modifications
   - Current: Basic logging only
   - Recommended: Complete audit trail
"""
elements.append(Paragraph(improvement_text, body_style))

elements.append(PageBreak())

# 10. Conclusion
elements.append(Paragraph("10. CONCLUSION AND SUMMARY", heading_style))
elements.append(Spacer(1, 0.15*inch))

conclusion_text = """
Zoo Management System is a modern, scalable web application built with React, Express, and SQLite. It successfully demonstrates:

✓ Full-stack development capabilities
✓ Proper separation of concerns (Frontend/Backend)
✓ RESTful API design principles
✓ Database relationships and constraints
✓ User authentication and role-based access
✓ Responsive UI with Tailwind CSS
✓ TypeScript for type safety

The application serves multiple user types with appropriate access levels and provides comprehensive management tools for zoo operations including animal care, staff management, inventory control, and visitor services.
"""
elements.append(Paragraph(conclusion_text, body_style))
elements.append(Spacer(1, 0.2*inch))

elements.append(Paragraph("""
<b>System Performance:</b><br/>
• Frontend: React with Vite for fast development/builds<br/>
• Backend: Express on Node.js for high performance<br/>
• Database: SQLite for quick queries and local storage<br/>
• Deployment: Can be containerized with Docker<br/>
<br/>
<b>Future Enhancements:</b><br/>
→ Advanced reporting and analytics<br/>
→ Email/SMS notifications<br/>
→ Mobile application<br/>
→ Payment gateway integration<br/>
→ Real-time notifications with WebSockets<br/>
→ Multi-language support<br/>
→ API documentation (Swagger/OpenAPI)<br/>
→ Automated backups<br/>
→ User audit trail<br/>
→ Advanced search and filtering<br/>
<br/>
<b>Document Information:</b><br/>
Generated: {}<br/>
Version: 1.0<br/>
Status: Complete and Current<br/>
Last Updated: {}
""".format(datetime.now().strftime("%d-%m-%Y"), datetime.now().strftime("%d-%m-%Y")), body_style))

# Build PDF
doc.build(elements)
pdf_size = os.path.getsize(pdf_path) / 1024
print("\n" + "="*60)
print("✓ PDF DOCUMENTATION GENERATED SUCCESSFULLY!")
print("="*60)
print(f"📄 File Name: {pdf_path}")
print(f"📊 File Size: {pdf_size:.2f} KB")
print(f"📝 Total Pages: 10+")
print(f"📍 Location: {os.getcwd()}")
print("="*60)
print("\nDocumentation Contents:")
print("  1. Project Overview")
print("  2. Technology Stack")
print("  3. Project Architecture")
print("  4. Database Design (13 tables)")
print("  5. Backend API Endpoints")
print("  6. Frontend Structure")
print("  7. Communication Protocol")
print("  8. User Flows (4 examples)")
print("  9. Security Analysis")
print("  10. Conclusion & Future Enhancements")
print("="*60)
