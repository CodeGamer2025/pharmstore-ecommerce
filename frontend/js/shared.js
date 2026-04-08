const SERVER_URL = 'http://localhost:5000/api'; 

function getSession() { 
    try {
        let sessionTemp = sessionStorage.getItem('medSession');
        if (sessionTemp) return JSON.parse(sessionTemp);
        let sessionPerm = localStorage.getItem('medSession');
        if (sessionPerm) return JSON.parse(sessionPerm);
    } catch(e) { return null; }
    return null;
}

function logout() { 
    sessionStorage.removeItem('medSession'); 
    localStorage.removeItem('medSession'); 
    window.location.href = 'index.html'; 
}

const API = {
    async getInventory() { try { let res = await fetch(`${SERVER_URL}/inventory`); return await res.json(); } catch(e) { return []; } },
    async saveInventory(data) { await fetch(`${SERVER_URL}/inventory/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return { success: true }; },
    // Fast Stock Deduction
    async updateStock(cartItems) { await fetch(`${SERVER_URL}/inventory/update-stock`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cartItems) }); return { success: true }; },

    async getSales() { try { let res = await fetch(`${SERVER_URL}/sales`); return await res.json(); } catch(e) { return []; } },
    async saveSales(data) { await fetch(`${SERVER_URL}/sales/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return { success: true }; },
    // Fast Order Placement
    async addSale(singleOrder) { await fetch(`${SERVER_URL}/sales/new`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(singleOrder) }); return { success: true }; },
    // Fast Admin Status Update
    async updateOrderStatus(id, status, rejectReason) { await fetch(`${SERVER_URL}/sales/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, rejectReason }) }); return { success: true }; },

    async getUsers() { try { let res = await fetch(`${SERVER_URL}/users`); return await res.json(); } catch(e) { return []; } },
    async saveUsers(data) { await fetch(`${SERVER_URL}/users/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); return { success: true }; },
    // Fast Profile Update
    async updateUser(updatedData) { 
        await fetch(`${SERVER_URL}/users/update`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData) }); 
        return { success: true }; 
    }
};

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
});

window.showToast = function(message, typeOrIsError = 'success') {
    let type = 'success';
    if (typeOrIsError === true || typeOrIsError === 'error') type = 'error';
    if (typeOrIsError === 'info') type = 'info';

    let container = document.getElementById('toastContainer');
    if (!container) return; 

    const toast = document.createElement('div');
    toast.className = `adv-toast toast-${type}`;

    let iconSvg = '';
    let title = '';
    if (type === 'success') {
        title = 'Success!';
        iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
        title = 'Action Failed';
        iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
        title = 'Notice';
        iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 400); 
    }, 4000); 
};

async function initDB() {
    try {
        let inventory = await API.getInventory();
        if (inventory.length === 0 || !inventory[0].medId || inventory.length !== 12) {
            console.log("Seeding 12 precise medicines (2 per category)...");
            sessionStorage.removeItem('medCart'); 
            
            const imgPills = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400";
            const imgSyrup = "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400";
            const imgDevice = "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=400";
            
            const defaultStock = [
                { medId: "m1", name: 'Dolo 650 Tablet', manufacturer: 'Micro Labs Ltd', mrp: 30.90, price: 25.00, qty: 150, expiry: '2026-12-31', category: 'Fever & Pain', requiresRx: false, image: imgPills },
                { medId: "m2", name: 'Crocin Advance', manufacturer: 'GSK', mrp: 20.00, price: 18.50, qty: 200, expiry: '2027-01-15', category: 'Fever & Pain', requiresRx: false, image: imgPills },
                { medId: "m3", name: 'Corex DX Syrup', manufacturer: 'Pfizer Ltd', mrp: 110.00, price: 95.00, qty: 30, expiry: '2025-11-30', category: 'Cough & Cold', requiresRx: true, image: imgSyrup },
                { medId: "m4", name: 'Benadryl Cough Syrup', manufacturer: 'Johnson & Johnson', mrp: 125.00, price: 110.00, qty: 80, expiry: '2026-04-12', category: 'Cough & Cold', requiresRx: false, image: imgSyrup },
                { medId: "m5", name: 'Azithral 500 Tablet', manufacturer: 'Alembic', mrp: 120.00, price: 105.00, qty: 85, expiry: '2027-02-28', category: 'Antibiotics', requiresRx: true, image: imgPills },
                { medId: "m6", name: 'Augmentin 625 Duo', manufacturer: 'GSK', mrp: 210.00, price: 195.00, qty: 40, expiry: '2026-06-15', category: 'Antibiotics', requiresRx: true, image: imgPills },
                { medId: "m7", name: 'Gluconorm-G1 Forte', manufacturer: 'Lupin Ltd', mrp: 185.00, price: 160.00, qty: 110, expiry: '2026-07-07', category: 'Diabetes', requiresRx: true, image: imgPills },
                { medId: "m8", name: 'Accu-Chek Test Strips', manufacturer: 'Roche', mrp: 999.00, price: 850.00, qty: 100, expiry: '2025-10-31', category: 'Diabetes', requiresRx: false, image: imgDevice },
                { medId: "m9", name: 'Ecosprin 75 Tablet', manufacturer: 'USV Ltd', mrp: 15.00, price: 12.00, qty: 300, expiry: '2028-05-15', category: 'Heart Care', requiresRx: true, image: imgPills },
                { medId: "m10", name: 'Rosuvas 10 Tablet', manufacturer: 'Sun Pharma', mrp: 180.00, price: 160.00, qty: 75, expiry: '2026-11-25', category: 'Heart Care', requiresRx: true, image: imgPills },
                { medId: "m11", name: 'Telma 40 Tablet', manufacturer: 'Glenmark', mrp: 215.00, price: 190.00, qty: 110, expiry: '2027-01-20', category: 'Blood Pressure', requiresRx: true, image: imgPills },
                { medId: "m12", name: 'Amlokind-AT', manufacturer: 'Mankind Pharma', mrp: 85.00, price: 70.00, qty: 220, expiry: '2028-03-03', category: 'Blood Pressure', requiresRx: true, image: imgPills }
            ];
            await API.saveInventory(defaultStock);
            
            let users = await API.getUsers();
            if(!users.find(u => u.username === 'admin')) {
                // FIX: Admin default account given a Full Name
                users.push({ username: 'admin', fullName: 'PharmStore Admin', password: '123', role: 'admin', email: 'admin@pharmstore.com', mobile: '0000000000', addresses: [] });
                await API.saveUsers(users);
            }
        }
    } catch (error) { console.error("Could not connect to backend server."); }
}
initDB();