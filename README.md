# ⚕️ PharmStore - Premium E-Commerce & Inventory Management System

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

PharmStore is a full-stack, enterprise-grade e-commerce web application designed for pharmaceutical retail. It features a complete customer-facing storefront with a secure checkout process, integrated prescription image compression, and a restricted Admin Dashboard for real-time inventory and order management.

---

## ✨ Key Features

### 🛒 Customer Storefront
* **Smart Catalog:** Real-time search and category filtering for medical products.
* **Intelligent Cart:** Live stock validation prevents users from adding out-of-stock items to their cart.
* **Prescription Upload System:** Dynamically detects if an item requires a prescription and mandates image uploads before checkout. Features an advanced **client-side HTML5 Canvas image compressor** to reduce 5MB+ images down to ~30KB without losing handwritten details.
* **Secure Checkout:** Multi-step checkout supporting Saved Addresses, UPI, Credit Card (with strict regex validation), and Cash on Delivery.
* **User Profiles:** Customers can track live order statuses (Verifying, Accepted, Rejected with Admin feedback).

### 🏥 Admin Dashboard
* **Real-Time Analytics:** Visual Chart.js data rendering revenue, pending approvals, and low-stock alerts.
* **Inventory Management (IMS):** Full CRUD capabilities to add, edit, or remove medicines and toggle their "Prescription Required" status.
* **Order Processing:** Admins can view customer details, verify uploaded prescriptions through an interactive Image Gallery Modal, and formally Accept or Reject orders.
* **Enterprise Memory Management:** The dashboard utilizes backend pagination to ensure instant load times, regardless of database size.

---

## ⚙️ Architecture & Optimizations

This project was built with a focus on high performance and database efficiency:
* **Decoupled API Routing:** Replaced bulk database overwriting with targeted MongoDB `$inc` and `$set` operators, reducing API payload sizes from Megabytes to Kilobytes.
* **High-Speed Indexing:** MongoDB schemas utilize `index: true` on critical tracking IDs, reducing search queries from O(N) to O(1) time complexity.
* **DOM Memory Protection:** Modals and dynamic UI elements utilize global Event Listeners (`Escape` key, outside-click detection) and strict CSS bounding to prevent browser memory leaks and UI distortion.

---

## 🛠️ Local Installation & Setup

Follow these steps to run the project on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your computer.
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and database cluster.
* Git installed on your computer.

### Step 1: Clone the Repository
Open your terminal and run:
```bash
git clone [https://github.com/your-username/pharmstore-ecommerce.git](https://github.com/your-username/pharmstore-ecommerce.git)
cd pharmstore-ecommerce
```

### Step 2: Install Backend Dependencies
Install the required Node.js packages by running:
```bash
npm install express mongoose cors dotenv
```

### Step 3: Configure Environment Variables
1. Create a new file in the root directory and name it exactly `.env`.
2. Inside `.env`, paste your MongoDB connection string like this (replace with your actual URL):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pharmstore?retryWrites=true&w=majority
PORT=5000
```

### Step 4: Start the Backend Server
Run the following command to boot up the Node.js server:
```bash
node server.js
```
*You should see a message saying "Successfully connected to MongoDB Atlas Cloud!"*

### Step 5: Launch the Frontend
Open `index.html` in your web browser. (If you are using VS Code, it is recommended to use the **Live Server** extension to open the file).

---

## ☁️ Cloud Deployment Guide

To host this project live on the internet:

1. **Backend (Render):**
   * Go to [Render.com](https://render.com/) and create a "New Web Service".
   * Connect this GitHub repository.
   * Add your `MONGO_URI` under the **Environment Variables** section.
   * Click Deploy. Copy the live URL Render gives you.
2. **Frontend Connection:**
   * Open `shared.js` and change `const SERVER_URL = 'http://localhost:5000/api';` to your new Render URL.
3. **Frontend (Netlify):**
   * Go to [Netlify.com](https://www.netlify.com/) and click "Add New Site" -> "Import an existing project".
   * Select your GitHub repository and click "Deploy Site". 

---

## 🔐 Default Demo Accounts

For grading, evaluation, and testing purposes, use the following credentials to access the secure Admin Panel:

**Admin Access:**
* **Username:** `admin`
* **Password:** `123`
*(Logging in with these credentials will automatically route you to the backend dashboard).*

**Customer Access:**
To test the standard Customer flow, please register a new account via the storefront portal.

---

## 👨‍💻 Author

**Parthiv Rathod**
* Computer Science & Engineering 