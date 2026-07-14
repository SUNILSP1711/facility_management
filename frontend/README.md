# Facility Management System - Frontend

React + Vite frontend for campus facility management system.

## Prerequisites

- Node.js 16+ and npm

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend root directory:

```bash
cp .env.example .env
```

Update `.env` with your values:

```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   └── ProtectedRoute.jsx
├── context/            # React context (Auth)
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   ├── FacilitiesManagement.jsx
│   ├── BookingsManagement.jsx
│   ├── IssuesManagement.jsx
│   ├── StaffFacilities.jsx
│   ├── BookingForm.jsx
│   ├── MyBookings.jsx
│   ├── ReportIssue.jsx
│   └── MyIssues.jsx
├── services/           # API service layer
│   └── api.js
├── styles/             # CSS files
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Features

### Admin Features
- Dashboard with facility utilization stats
- Facility CRUD operations
- Booking management (approve/reject)
- Issue management (update status)

### Staff Features
- Browse and filter available facilities
- Create booking requests with conflict detection
- View and cancel bookings
- Report facility issues
- View reported issues status

## Authentication

- Google OAuth2 login
- JWT token-based API authentication
- Role-based routing (ADMIN/STAFF)
- Automatic token refresh in API interceptor

## API Integration

All API calls go through the centralized `api.js` service with:
- Automatic JWT token attachment to headers
- Error handling
- Base URL configuration

## Styling

- Plain CSS with responsive design
- Mobile-first approach
- Consistent color scheme and typography
- Accessible form elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
