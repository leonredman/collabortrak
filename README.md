
# CollaborTrak
## B.S., SOFTWARE ENGINEERING CAPSTONE
CollaborTrak MVP is a full-stack project management simple issue tracking app built with developers and creative teams in mind. It was modeled on the Jira workflow of my previous role as a website builder at GoDaddy - WDS. It supports role-based dashboards, ticket workflows, and basic search and reporting for teams that need structure without getting overwhelmed.

This is my capstone project for my Software Engineering degree — built to show I can handle both backend and frontend development, plus deployment and simple authentication.


## Tech Stack

- **Frontend:** React + Vite + Semantic UI
- **Backend:** Spring Boot + Spring Security (session-based auth)
- **Database:** MySQL (hosted on Railway)
- **Hosting:**
    - Frontend: Vercel
    - Backend: Railway
- **Other:** JPA, Role-based access, REST API, CORS config

## Features

- Login system with role-based routing (Admin, Manager, Developer, QA Agent, Website Specialist)
- Create and manage tickets: Epics, Stories, Tasks, Bugs
- Linked tickets (e.g., Stories tied to Epics, Bugs tied to Stories)
- Status workflows tailored by role
- Admin dashboard with ticket stats
- QA dashboard with ticket status widgets
- Search and reports page for viewing tickets across roles

## Demo Logins

Use these credentials to test the app:

| Role               | Username | Password               |
|--------------------|----------|------------------------|
| Admin              | admin    | adminSecure2025        |
| Manager            | manager  | manageradminSecure2025 |
| Developer          | dev      | devadminSecure2025     |
| QA Agent           | qa       | qaadminSecure2025      |
| Website Specialist | web      | webadminSecure2025     |

Each role has a unique dashboard and permissions.

## Running It Locally

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL running locally or through a service like MAMP

### 1. Clone the Repository

```bash
git clone https://github.com/leonredman/collabortrak.git
cd collabortrak
```

### 2. Set Up the Backend

- Navigate to the backend directory:

```bash
cd collabortrak
```

- Create or update `application-local.properties` with the following settings:

```properties
server.port=8080
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.same-site=Lax
spring.datasource.url=jdbc:mysql://localhost:8889/collabortrak_dbase
spring.datasource.username=root
spring.datasource.password=root
```

- Start the Spring Boot backend:

```bash
./mvnw spring-boot:run
```

### 3. Set Up the Frontend

- Navigate to the frontend directory:

```bash
cd ../collabortrak-frontend
```

- Create a `.env` file in the root of the frontend folder:

```env
VITE_BACKEND_URL=http://localhost:8080
```

- Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Deployment

- Frontend: vercel.com [https://collabortrak.vercel.app](https://collabortrak.vercel.app)
- Backend: railway.com https://collabortrak-production.up.railway.app/

These are configured to work together over HTTPS using session cookies.

## Known Limitations

- Safari (especially versions 15–18) may block session cookies due to strict cross-origin policies. The app works reliably in Chrome and Firefox.
- Local development uses relaxed cookie settings to allow testing across ports.
- Demo user passwords do not follow browser best practices for length etc.

## Future Improvements

- Add more unit and integration tests
- JWT-based authentication to avoid browser cookie issues
- File upload, ticket history/logging, email notifications and ticket commenting 
- Expanded reporting and filter options
