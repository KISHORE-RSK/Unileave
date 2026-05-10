UniLeave – Backend

Backend service for UniLeave, a role-based Student Leave Management System built using the MERN stack.
This backend handles authentication, role-based access control, and core business logic for students, faculty, and administrators.

----------------------------------------------------------------

Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)

----------------------------------------------------------------

Project Structure (Backend)

Backend/
│
├── server.js                 Entry point
├── package.json
├── .env                      Environment variables (not committed)
├── .env.example              Sample env file
│
├── src/
│   ├── app.js                Express app setup
│   │
│   ├── config/
│   │   └── db.js             MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js           User schema
│   │   └── LeaveRequest.js   Leave request schema
│   │
│   ├── controllers/
│   │   └── auth.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── routes/
│   │   └── auth.routes.js
│   │
│   ├── utils/
│   │   └── password.js       Password hashing utilities
│   │
│   └── seed/
│       └── seedUsers.js      One-time user seeding script

----------------------------------------------------------------

How to Run the Backend (First Time Setup)

1. Clone the repository

git clone https://github.com/Praneeth2607/UniLeave.git
cd UniLeave/Backend

----------------------------------------------------------------

2. Install dependencies

npm install

----------------------------------------------------------------

3. Create the .env file

Create a file named .env in the Backend root.

Example:

PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/Leave_Management

JWT_SECRET=unileave_backend_secret

Notes:
- Do not wrap values in quotes
- Make sure your IP is whitelisted in MongoDB Atlas
- Database name must be included at the end of the URI

----------------------------------------------------------------

4. MongoDB Atlas Configuration

- Security → Network Access
  Add IP: 0.0.0.0/0 (for development)

- Security → Database Access
  Grant user: Read and write to any database

----------------------------------------------------------------

5. Seed initial users

The backend does not have a registration API.
Users are created using a seed script.

Run:

node src/seed/seedUsers.js

This creates:
- 1 Admin
- 1 Faculty
- 1 Student (linked to faculty)

Sample credentials (development only):

Admin    admin@college.edu    admin123
Faculty  faculty@college.edu  faculty123
Student  student@college.edu  student123

----------------------------------------------------------------

6. Start the backend server

npm run dev

Expected output:

MongoDB connected successfully
Server running on port 5000

----------------------------------------------------------------

7. Verify backend is running

GET http://localhost:5000/health

Response:
{ "status": "Backend is running" }

----------------------------------------------------------------

Authentication Flow Summary

- POST /api/auth/login
- Backend verifies credentials
- JWT token is generated and returned
- Frontend stores token
- Token is sent in Authorization header for protected routes
- Backend verifies token on every request

----------------------------------------------------------------

Important Notes

- node_modules is ignored via .gitignore
- .env is never committed to GitHub
- Backend is stateless (JWT-based authentication)
- Logout is handled on the frontend by removing the token

----------------------------------------------------------------

Current Status

The backend currently supports:
- MongoDB connection
- User schema with roles
- Password hashing
- JWT-based login
- Seeded users for development

Next steps:
- Student leave request APIs
- Faculty approval workflows
- Admin reporting APIs
