
# ☕ BrewFlow - Full Stack Coffee Shop System

**BrewFlow** is a complete web application for remote coffee ordering. It features a secure REST API backend, a dynamic frontend, role-based access control, and real-time order tracking with email notifications.

---

## 🚀 Live Demo
**🌐 Website:** [https://brewflow-api.onrender.com](https://brewflow-api.onrender.com)  
*(Note: Please allow 50 seconds for the server to wake up on first load)*

---

## ✨ Key Features

### **1. User System & Security**
* **Authentication:** Secure registration and login using **JWT (JSON Web Tokens)**.
* **Password Encryption:** User passwords are hashed using **BCrypt** before storage.
* **Role-Based Access Control (RBAC):**
    * **Customer:** Can browse menu, place orders, and view personal order history.
    * **Barista/Admin:** Can manage the menu (Add/Delete items), view all incoming orders, and update order status.

### **2. Order Management**
* **Real-Time Status:** Orders move through stages: `Pending` ➝ `Brewing` ➝ `Ready` ➝ `Completed`.
* **Color-Coded History:** Visual indicators for order status (Red/Orange/Green).

### **3. Advanced Integrations (Final Requirement)**
* **📧 SMTP Email Service:** Integrated **Nodemailer** with Gmail SMTP.
    * *Function:* Automatically sends a branded confirmation email to the user immediately after an order is placed.
* **☁️ Cloud Database:** Data is persisted using **MongoDB Atlas**.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **Utilities:** Nodemailer (Email), Cors, Dotenv
* **Deployment:** Render (Web Service)

---

## 📸 Screenshots

### **1. Landing Page & Menu**
*(Replace this link with your actual screenshot of the home page)*
![Home Page](https://via.placeholder.com/800x400?text=Screenshot+of+Home+Page)

### **2. Customer Order History**
*(Show the modal with the color-coded status)*
![My Orders](https://via.placeholder.com/800x400?text=Screenshot+of+Order+History)

### **3. Barista Dashboard (Admin)**
*(Show the incoming orders and Delete buttons)*
![Barista Dashboard](https://via.placeholder.com/800x400?text=Screenshot+of+Barista+Dashboard)

---

## ⚙️ Installation & Setup

If you want to run this project locally, follow these steps:

### **1. Clone the Repository**
```bash
git clone https://github.com/daminkavitaminka/brewflow-backend.git
cd brewflow-backend
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add the following:

```bash
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_16_char_app_password
```

### **4. Run the Server**
```bash
node server.js
```
The app will be available at [http://localhost:8080](http://localhost:8080).

---

## 📝 API Endpoints Documentation

| Method | Endpoint                | Description                                      | Access         |
|--------|-------------------------|--------------------------------------------------|----------------|
| **AUTH** |                         |                                                  |                |
| POST   | /api/auth/register       | Register a new user                             | Public         |
| POST   | /api/auth/login          | Login and get Token                             | Public         |
| **PRODUCTS** |                     |                                                  |                |
| GET    | /api/products            | Get full menu                                   | Public         |
| POST   | /api/products            | Add new coffee item                             | Barista        |
| DELETE | /api/products/:id        | Delete an item                                  | Barista        |
| **ORDERS** |                      |                                                  |                |
| POST   | /api/orders              | Place a new order (Triggers Email)              | User           |
| GET    | /api/orders/my-orders    | Get user's history                              | User           |
| GET    | /api/orders              | Get all active orders                           | Barista        |
| PUT    | /api/orders/:id          | Update status (Brewing/Ready)                   | Barista        |

---

## 🧪 Testing Credentials

To test the Barista features (Dashboard, Delete Items), use this account:

**Username:** barista_john  
**Password:** admin123 (Or whatever password you set)
