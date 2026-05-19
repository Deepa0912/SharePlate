# SharePlate - Project Presentation Brief

## 🌟 Project Vision & Overview
**SharePlate** is a full-stack web application designed to bridge the gap between food surplus and food scarcity. It provides a platform where users can donate excess food, and others can view and claim these donations. The goal is to reduce food waste and help communities by connecting donors with those in need.

---

## 🛠️ Technology Stack
The project is built using a modern, robust, and scalable tech stack:

### Frontend (Client-side)
* **Framework:** React.js (built with Vite for fast compilation)
* **Styling:** Tailwind CSS (for modern, responsive, and rapid UI development)
* **Routing:** React Router DOM (for seamless Single Page Application navigation)
* **HTTP Client:** Axios (for communicating with the backend API)

### Backend (Server-side)
* **Framework:** FastAPI (Python-based, high-performance web framework)
* **Authentication:** JWT (JSON Web Tokens) & bcrypt (for secure password hashing)
* **Image Processing:** Cloudinary (for uploading and hosting donation food images)
* **CORS Middleware:** Configured to allow secure cross-origin requests from the React frontend.

### Database
* **Database:** MongoDB (NoSQL database for flexible data storage)
* **Collections:** 
  * `users` (Stores user credentials and roles)
  * `donations` (Stores food donation listings)

---

## 🚀 Core Features & Workflows

### 1. User Authentication System
* **Signup:** Users can register an account by providing their Name, Email, Password, and Role (e.g., Donor, Receiver). Passwords are securely hashed using `bcrypt` before storing in the database.
* **Login:** Registered users can log in securely. Upon successful authentication, the backend generates a **JWT token** that expires in 24 hours, keeping the user securely logged in for their session.

### 2. Food Donation Workflow
* **Donate Food:** Logged-in users can list surplus food. They provide:
  * Food Name & Quantity
  * Expiry Time & Location
  * Food Image (Uploaded directly to **Cloudinary** for scalable image hosting)
* Once submitted, the donation status is marked as "Pending" and saved to the database.

### 3. Food Feed / Dashboard
* **View Donations:** The platform fetches all active food listings from the backend and displays them on the frontend, allowing users to browse available food in their area.
* **Manage Donations:** Users (or admins) have the ability to remove a donation listing once it's claimed, expired, or no longer available.

---

## 🖥️ User Interface Structure
The application is structured cleanly into distinct pages:
* **Home Page:** The landing page introducing the platform's mission.
* **Signup & Login Pages:** Secure forms for user onboarding and authentication.
* **Dashboard:** The main feed where active donations are listed and where donors can create new listings.

---

## 💡 Key Highlights for Teachers
When presenting, you can highlight the following technical achievements:
1. **Security:** Implemented secure password hashing (bcrypt) and stateless session management (JWT).
2. **Modern Architecture:** Separated Frontend and Backend (REST API architecture) ensuring scalability.
3. **Third-Party Integration:** Successfully integrated Cloudinary for robust image hosting rather than storing images locally.
4. **Performance:** Chose FastAPI for the backend, known for its high speed and asynchronous capabilities.
