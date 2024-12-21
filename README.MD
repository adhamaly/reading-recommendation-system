# ** Reading Recommendation App**

## **Overview**

The Reading Recommendation System API provides a simple and efficient way for users to submit their reading intervals and get recommendations for the top-rated books in the system. The API implements role-based authorization, logging and exception handling, and unit tests to ensure secure, reliable, and maintainable code. It utilizes **NestJS** for the backend and **Prisma** for the database layer.

## **Features**

- **Authentication:** Users can register and login to our system
- **CRUD Operations:** Create, Read, Update and Delete book data APIs by Admin User.
- **Pagination:** Provides pagination support for book listings.
- **Submit Book Reading Interval:** System provider an API which is provide a simple and efficient way for users to submit their reading intervals.
- **System Recommendation for Top-Rated books:** System provider an API which is allow users to get the top five recommended books in the system.
- **API Documentation:** Automatically generated API documentation using Swagger.

## **Tech Stack**

- **Backend Framework:** NestJS
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (optional for securing APIs)
- **Testing:** Jest
- **Containerization:** Docker

## **Setup**

### **Prerequisites**

Before starting, ensure you have the following installed:

- **Node.js** (>= 18.x)
- **Docker** and **Docker Compose** (for containerization)
- **PostgreSQL**

### **Step 1: Clone the Repository**

Clone this repository to your local machine:

```bash
git clone https://github.com/adhamaly/reading-recommendation-system
cd reading-recommendation-system
```

### **Step 2: Install Dependencies**

To install the necessary dependencies for the project, run the following command:

```bash
npm install
```

### **Step 3: Configure Environment Variables**

Create a .env file in the root directory of the project by copying the example file:

```bash
cp .env.example .env
```

```bash
NODE_ENV="dev"

# DATABASE SECRETS
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

# nest run in docker container
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public

# nest run locally
#DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/recommendation-db?schema=public"

# USER SECRETS
USER_JWT_SECRET=""
USER_JWT_EXPIRY=

# ADMIN SECRETS
ADMIN_JWT_SECRET=""
ADMIN_JWT_EXPIRY=

# ADMIN ACCOUNT
ADMIN_EMAIL=""
ADMIN_PASSWORD=""


SALT=10

```

### **Step 3: Step 4: Prisma Migrations**

Generate the database schema with Prisma:

```bash
npx prisma migrate dev
```

### **Step 5: Step 4: Running the Application**

Local Development
To run the app in development mode, use the following command

```bash
npm run start:dev
```

Docker Setup
Alternatively, you can use Docker to run the application. Build and run the containers using

```bash
docker-compose up --build
```

The app will be available at http://localhost:3000/recommendation-system/docs.
