const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Loads your hidden environment variables
require('dotenv').config(); 

const app = express();

app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 

// Safely pulls the link from your hidden .env file
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: Missing MONGO_URI. Please check your .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI, { family: 4 })
.then(() => console.log("☁️ Successfully connected to MongoDB Atlas Cloud!"))
.catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// ==========================================
// 🏗️ HIGH-SPEED DATABASE SCHEMAS
// ==========================================
// Added 'index: true' so MongoDB creates a lightning-fast search map
const medicineSchema = new mongoose.Schema({ medId: { type: String, index: true } }, { strict: false }); 
const userSchema = new mongoose.Schema({ username: { type: String, index: true } }, { strict: false });
const orderSchema = new mongoose.Schema({ id: { type: String, index: true } }, { strict: false });

const Medicine = mongoose.model('Medicine', medicineSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 📦 INVENTORY ROUTES
// ==========================================
app.get('/api/inventory', async (req, res) => {
    const data = await Medicine.find({}, { _id: 0 }).lean(); 
    res.json(data);
});
app.post('/api/inventory/bulk', async (req, res) => {
    await Medicine.deleteMany({}); 
    if (req.body.length > 0) await Medicine.insertMany(req.body); 
    res.json({ success: true });
});
// 🚀 FAST OPTIMIZATION: Updates stock instantly
app.post('/api/inventory/update-stock', async (req, res) => {
    const cartItems = req.body;
    for (let item of cartItems) {
        await Medicine.updateOne({ medId: item.medId }, { $inc: { qty: -item.cartQty } });
    }
    res.json({ success: true });
});

// ==========================================
// 👤 USER ROUTES
// ==========================================
app.get('/api/users', async (req, res) => {
    const data = await User.find({}, { _id: 0 }).lean();
    res.json(data);
});
app.post('/api/users/bulk', async (req, res) => {
    await User.deleteMany({});
    if (req.body.length > 0) await User.insertMany(req.body);
    res.json({ success: true });
});
// 🚀 FAST OPTIMIZATION: Updates one user profile instantly
app.put('/api/users/update', async (req, res) => {
    const userData = req.body;
    await User.updateOne({ username: userData.username }, { $set: userData });
    res.json({ success: true });
});

// ==========================================
// 📊 SALES/ORDER ROUTES
// ==========================================
app.get('/api/sales', async (req, res) => {
    const data = await Order.find({}, { _id: 0 }).lean();
    res.json(data);
});
app.post('/api/sales/bulk', async (req, res) => {
    await Order.deleteMany({});
    if (req.body.length > 0) await Order.insertMany(req.body);
    res.json({ success: true });
});
// 🚀 FAST OPTIMIZATION: Adds 1 order instantly
app.post('/api/sales/new', async (req, res) => {
    await Order.create(req.body);
    res.json({ success: true });
});
// 🚀 FAST OPTIMIZATION: Admin Accept/Reject instantly
app.put('/api/sales/status', async (req, res) => {
    const { id, status, rejectReason } = req.body;
    await Order.updateOne({ id }, { $set: { status, rejectReason } });
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));