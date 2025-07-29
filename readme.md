# Big Biz PIM MVP 
## Full-Stack Product Management Demo

### 🚀 Overview: Showcasing Full-Stack Aptitude & Product-Centric Development

This project is a **Full-Stack Product Information Management (PIM) Mini-MVP**, built to showcase code-first development capabilities, deep understanding of APIs (building/using) and a deep understanding of end-to-end software delivery. Designed as a hands-on demo exercise, it highlights my proficiency across modern web technologies and my commitment to code-first best practices.

### 🎯 Project Goal & Learning Focus
* **Code-First & Developer Workflow:** As I'm a Product Manager with a background in Software Architecture I wanted a project that flexed my dev skills again. Things like clean command-line interface (CLI) driven development, clear Git commit history, and a disciplined, iterative coding process and Single Responsibility MVC codebase. 

* **End-to-End Full-Stack Proficiency:** My big goal was to reinforce my knowledge and practice my workflow frontend (Next.js/React), backend (Node.js/Express), and database (PostgreSQL) integration. I am well versed in leading API first platforms, but there's nothing like putting fingers in the clay again so I focused on implementation from scratch and thinking about how this may play with my dynamic frontend. 

* **Reinforcement Learning:** I wanted to practice my ability to quickly pick up and implement new technologies for me that was mostly in the front-end I love Vanilla JS and have worked with EJS but I realize that Next.js, modern React patterns, Tailwind CSS is BIG today. So I wanted to establish these new skills.

* **Product Thinking & Initiative:** Built with a user-centric perspective (e.g., intuitive CRUD flows, refined display pages), and includes considerations for architectural clarity and future enhancements relevant to product scale.

* **Debugging and Data Flow:**
Extensive `console.log`s and detailed code comments are included throughout the codebase to reinforce deep knowledge of what's really happening at each step and visually watch the internal data flow.

### 🛠️ Technical Stack

* **Backend:**
    * **Node.js & Express.js:** Robust and scalable server-side environment.
    * **PostgreSQL:** Powerful relational database for data persistence.
    * **Sequelize ORM:** Object-Relational Mapper for intuitive database interaction.
    * **MVC Architecture:** Organized for clear separation of concerns (though `server.js` consolidation is a planned future enhancement for this MVP).
* **Frontend:**
    * **Next.js (React Framework):** Chosen for its popularity in enterprise-level applications, server-side rendering capabilities, and modern development experience.
    * **React:** Core library for building interactive user interfaces.
    * **TypeScript:** Enhances code quality, maintainability, and developer experience.
    * **Tailwind CSS:** Utility-first CSS framework for rapid UI development and a clean, modern aesthetic.
* **Tools & Environment:** Git, npm, VS Code, Postman, iTerm2 with Oh My Zsh.

### 🌟 Core Features Implemented (MVP)

This application provides a fully functional administrative interface for managing a product catalog:

* **Admin Authentication:** Secure login for administrators (`/login`).
* **Product Dashboard (`/admin/products`):**
    * Displays a list of all products in a clean, tabular format.
    * Allows sorting and basic filtering.
    * Links to **Add New Product** and individual **Product Edit/View** pages.
    * Provides **Delete** functionality (with confirmation).
* **Add New Product (`/admin/add-product`):**
    * A dedicated form for submitting new product details to the database.
    * Provides immediate feedback and redirection upon successful creation.
* **Edit Product (`/admin/products/[id]/edit`):**
    * Dynamic page that fetches and pre-fills an existing product's details into an editable form.
    * Allows updates to product information with immediate feedback.
* **Admin Product Detail View (`/admin/products/[id]/view`):**
    * A dynamic page providing a visually appealing, detailed display for a single product, including images and full descriptions. Designed with a "high-end website" aesthetic in mind.

### 🛠️ Microservice Drive Architecture & Approach

The project adheres to a **decoupled (API-driven) architecture** with clear separation between the frontend and backend:

* **Backend (API Layer):** Built with Node.js/Express, providing a RESTful API. It focuses solely on data persistence, business logic, schema definition and modeling of a product, and serving JSON responses. The MVC pattern is applied conceptually for structured logic.
* **Frontend (Presentation Layer):** Built with Next.js/React, snagging data from the backend API. It handles all user interface rendering, interactions, and client-side routing.

This setup exemplifies modern full-stack development patterns, allowing for independent scaling and technology choices for each layer. The codebase includes extensive `console.log` statements for debugging visibility and explanatory comments to walk through the logic.

### 🚀 Getting Started

Follow these steps to set up and run the project locally.

#### Prerequisites

* Node.js (LTS version, recommended via `nvm`)
* npm npm (comes with Node.js) or Yarn
* PostgreSQL database server

#### 1. Clone the Repository

```bash
git clone [https://github.com/trose16/big-biz-mvp.git](https://github.com/trose16/big-biz-mvp.git)
cd big-biz-mvp
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

#### 3. Create .env file:

* Create a new file named .env in the backend/ directory.

* Important: This file is intentionally not committed to Git for security reasons.

* Add the following variables to backend/.env:

```
PORT=5050
DATABASE_URL="postgres://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/bigbiz_pim_mvp"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="supersecretpassword"
JWT_SECRET="your_strong_secret_key"
```

#### 4. Start PostgreSQL:
Ensure your local PostgreSQL server is running and the bigbiz_pim_mvp database exists.

Run Backend Server:
```
npm run dev
```
#### 5. Frontend Setup:
```
cd ../frontend
npm install
```
* Create .env.local file:

* Create a new file named .env.local in the frontend/ directory.

* Important: This file is also intentionally not committed to Git.

* Add the following variable to frontend/.env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

Run Frontend Server:
```
npm run dev
```

### 🧐 Ideally, What's Next? / Future PoC Enhancements

If this were a real product here are some of the things I'd prioritize to get this into production as a true testable PoC. 

### Backend Refactoring:

* Modularize server.js: Separate core application logic into dedicated controllers/ and routes/ files (as planned and partially implemented for authentication), further enhancing the MVC pattern and maintainability.

* Dedicated Model Files: Ensure each Sequelize model resides in its own file (Product.js, etc.).

* Enhanced Authentication & Authorization: Implement JSON Web Tokens (JWTs) for more secure and stateless authentication.

* Add password hashing (e.g., bcrypt) for user passwords.

* Introduce role-based access control (RBAC) to differentiate between admin and standard users (e.g., standard users can only view products, not edit/delete).

### Advanced Frontend UI/UX:

* Make it prettier. Ya know I started as a designer so I'd want the entire experience to be more asthetically pleasing in terms of look and feel. As of now it's pretty utilitarian. 

* Implement image uploads (frontend to backend) instead of just URL links.

* Add client-side form validation for a smoother user experience.

* Improve loading and error states with more sophisticated UI elements (spinners, toasts).

* Implement search, filtering, and pagination on the product dashboard.

* Develop a public-facing product list (e.g., /products) with a responsive card layout, separate from the admin dashboard.

* Database Migrations: Implement controlled database schema changes using Sequelize Migrations, rather than sequelize.sync({ force: true }) in development.

* Testing: Add unit and integration tests for both frontend and backend.

* Deployment Automation: Set up CI/CD pipelines for automated deployment.