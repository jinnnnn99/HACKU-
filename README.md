
# Activity Matching Platform

The Activity Matching Platform is a web application designed to connect people who want to engage in group activities like sports, dining, or social events. It solves the common problem of finding companions for activities that require multiple participants, while using a point-based system to ensure commitment.

## Core Features

### Activity Management
- Browse available activities by category
- Create new activities as an organizer
- Join activities as a participant
- View detailed activity information

### Point-Based Commitment System
- Users receive initial points upon registration
- Points are spent to join activities
- Points are refunded upon verified attendance
- This prevents no-shows and ensures commitment

### Attendance Verification
- QR code-based attendance verification
- Organizers can scan participants' QR codes
- Points are automatically refunded upon verification
- Creates accountability and rewards follow-through

### User Management
- User profiles with point balances
- Purchase more points if needed
- Track joined and created activities
- Personalized QR code for verification

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Modern UI with responsive design
- QR code generation and scanning capabilities

### Backend (Future Implementation)
- FastAPI backend (planned)
- Database for user data and activities
- Authentication and authorization
- Payment processing for point purchases

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/activity-platform.git
   cd activity-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Examples

### Creating an Activity
1. Navigate to "Create Activity" page
2. Fill in activity details (name, description, date, location, etc.)
3. Set the point cost for participation
4. Submit the form to create the activity

### Joining an Activity
1. Browse available activities on the home page
2. Click "Join" on an activity that interests you
3. Points will be deducted from your balance
4. Attend the activity and get your QR code scanned to receive a refund

### Verifying Attendance
1. Organizers navigate to "Verify Attendance" page
2. Scan participants' QR codes or enter their ID manually
3. Select the relevant activity
4. Confirm attendance which triggers point refund

### Purchasing Points
1. Navigate to "Buy Points" page
2. Select desired point package
3. Complete payment information
4. Points are added to user's balance

## Project Structure

```
activity-platform/
│
├── public/                  # Public assets
│
└── src/                     # Source files
    ├── components/          # React components
    │   ├── Home.js          # Activity listing page
    │   ├── CreateEvent.js   # Activity creation form
    │   ├── Profile.js       # User profile with QR code
    │   ├── Navbar.js        # Navigation component
    │   ├── ActivityDetails.js # Detailed activity view
    │   ├── PurchasePoints.js # Point purchasing interface
    │   └── AttendanceVerification.js # QR code scanner
    │
    ├── App.js               # Main application component
    ├── index.js             # Application entry point
    └── styles.css           # Global styles
```

## Future Enhancements

1. **User Authentication**
   - Registration and login system
   - Social login options
   - User roles (admin, organizer, participant)

2. **Advanced Activity Features**
   - Categories and tags for better filtering
   - Recurring activities
   - Rating and review system
   - Activity recommendations

3. **Communication Tools**
   - In-app messaging between participants
   - Activity-specific discussion boards
   - Notifications for upcoming activities

4. **Mobile App**
   - Native mobile experience
   - Push notifications
   - Location-based activity suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Special thanks to all contributors
- Inspired by the need to solve the problem of finding activity partners
- Built with modern web technologies
=======

# Hacku
