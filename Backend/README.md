# HRMS Backend API

A comprehensive Human Resource Management System backend built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, HR, Employee)
  - Password hashing with bcrypt
  - Password change and reset functionality

- 👥 **User Management**
  - User registration and login
  - User profile management
  - Role management
  - User status management

- 🏢 **Employee Management**
  - Complete employee profiles
  - Employment details
  - Document management
  - Skills and experience tracking

- 📅 **Leave Management**
  - Leave request creation
  - Leave approval/rejection workflow
  - Leave type management
  - Leave balance tracking

- ⏰ **Attendance Management**
  - Check-in/Check-out functionality
  - Attendance tracking
  - Overtime calculation
  - Attendance reports

- 👨‍💼 **Candidate Management**
  - Job candidate profiles
  - Interview scheduling
  - Application status tracking
  - Document uploads

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd HRMS-project/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hrms_db
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud service)

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password

### Users
- `GET /api/users` - Get all users (Admin/HR only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PATCH /api/users/:id/toggle-status` - Toggle user status (Admin/HR only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)

### Employees
- `GET /api/employees` - Get all employees (Admin/HR only)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin/HR only)
- `PUT /api/employees/:id` - Update employee (Admin/HR only)
- `DELETE /api/employees/:id` - Delete employee (Admin only)

### Leaves
- `GET /api/leaves` - Get all leaves
- `GET /api/leaves/:id` - Get leave by ID
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave request
- `PATCH /api/leaves/:id/approve` - Approve leave (Admin/HR only)
- `PATCH /api/leaves/:id/reject` - Reject leave (Admin/HR only)
- `DELETE /api/leaves/:id` - Delete leave request

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/report/monthly` - Monthly report (Admin/HR only)
- `GET /api/attendance/report/employee/:employeeId` - Employee report

### Candidates
- `GET /api/candidates` - Get all candidates (Admin/HR only)
- `GET /api/candidates/:id` - Get candidate by ID (Admin/HR only)
- `POST /api/candidates` - Create candidate (Admin/HR only)
- `PUT /api/candidates/:id` - Update candidate (Admin/HR only)
- `PATCH /api/candidates/:id/status` - Update status (Admin/HR only)
- `POST /api/candidates/:id/interview` - Schedule interview (Admin/HR only)
- `DELETE /api/candidates/:id` - Delete candidate (Admin only)

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Route Example
```bash
GET /api/users
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email",
      "value": "invalid-email"
    }
  ]
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different roles
- **Input Validation**: All inputs are validated using express-validator
- **CORS Protection**: Configured CORS for frontend integration
- **Helmet**: Security headers for protection against common vulnerabilities

## Database Models

### User Model
- Basic authentication fields
- Role management
- Profile information
- Timestamps

### Employee Model
- Detailed employee information
- Employment details
- Contact information
- Documents and skills

### Leave Model
- Leave request management
- Approval workflow
- Leave types and calculations

### Attendance Model
- Check-in/check-out tracking
- Time calculations
- Status management

### Candidate Model
- Job application management
- Interview scheduling
- Document uploads

## Development

### Project Structure
```
Backend/
├── config/
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── roleAuth.js
│   └── validate.js
├── models/
│   ├── User.js
│   ├── Employee.js
│   ├── Leave.js
│   ├── Attendance.js
│   └── Candidate.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── employeeRoutes.js
│   ├── leaveRoutes.js
│   ├── attendanceRoutes.js
│   └── candidateRoutes.js
├── utils/
├── index.js
├── package.json
├── config.env
└── README.md
```

### Adding New Features

1. **Create Model**: Add new model in `models/` directory
2. **Create Controller**: Add business logic in `controllers/` directory
3. **Create Routes**: Add API endpoints in `routes/` directory
4. **Update Main App**: Register new routes in `index.js`

## Testing

You can test the API using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Process Manager**: Use PM2 or similar for production
4. **Reverse Proxy**: Use Nginx or Apache
5. **SSL**: Configure HTTPS certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team. 