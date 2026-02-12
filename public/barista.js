const API_URL = 'https://brewflow-api.onrender.com/api'; // <--- MAKE SURE THIS IS YOUR RENDER LINK
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// 1. SECURITY CHECK
if (!token || (user.role !== 'barista' && user.role !== 'admin')) {
    alert("Access Denied: Staff Only");
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadBaristaMenu(); // <--- NEW: Load the menu items

    // Logout
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.clear();
        window.location.href = 'index.html';
    };

    // Add Product Logic
    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('p-name').value;
        const description = document.getElementById('p-desc').value;
        const price = document.getElementById('p-price').value;
        const category = document.getElementById('p-category').value;

        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify({ name, description, price, category })
            });

            if (res.ok) {
                alert("Item added to menu!");
                e.target.reset(); // Clear form
                loadBaristaMenu(); // <--- NEW: Refresh list immediately
            } else {
                alert("Failed to add item.");
            }
        } catch (err) { console.error(err); }
    });
});

// 2. FETCH & RENDER ORDERS
async function loadOrders() {
    const container = document.getElementById('orders-list');
    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'x-access-token': token }
        });
        const orders = await res.json();
        const activeOrders = orders.filter(o => o.status !== 'completed').reverse();

        if (activeOrders.length === 0) {
            container.innerHTML = '<p>No active orders. Time for a break! ☕</p>';
            return;
        }

        container.innerHTML = activeOrders.map(order => {
            let badgeClass = 'status-pending';
            if (order.status === 'brewing') badgeClass = 'status-brewing';
            if (order.status === 'ready') badgeClass = 'status-ready';

            const itemsHtml = order.items.map(i =>
                `<div>${i.quantity}x <strong>${i.product ? i.product.name : 'Unknown Item'}</strong></div>`
            ).join('');

            return `
            <div class="order-card">
                <div>
                    <div style="font-size:0.9rem; color:#888;">Order #${order._id.slice(-4)} • ${order.user.username}</div>
                    <div style="margin: 10px 0;">${itemsHtml}</div>
                    <div class="status-badge ${badgeClass}">${order.status}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:1.2rem; font-weight:bold; margin-bottom:10px;">$${order.totalAmount}</div>
                    ${getNextActionButton(order)}
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p>Error loading orders.</p>';
    }
}

// 3. GENERATE BUTTON
function getNextActionButton(order) {
    if (order.status === 'pending') {
        return `<button class="btn-primary action-btn" onclick="updateStatus('${order._id}', 'brewing')">Start Brewing</button>`;
    } else if (order.status === 'brewing') {
        return `<button class="btn-primary action-btn" style="background:#28a745;" onclick="updateStatus('${order._id}', 'ready')">Mark Ready</button>`;
    } else if (order.status === 'ready') {
        return `<button class="btn-secondary action-btn" onclick="updateStatus('${order._id}', 'completed')">Archive</button>`;
    }
    return '';
}

// 4. UPDATE STATUS
async function updateStatus(orderId, newStatus) {
    try {
        await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({ status: newStatus })
        });
        loadOrders();
    } catch (err) { alert("Error updating order."); }
}

// 5. NEW: LOAD MENU LIST
async function loadBaristaMenu() {
    const container = document.getElementById('barista-menu-container');
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();

        container.innerHTML = products.map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:10px 0;">
                <div>
                    <strong>${p.name}</strong>
                    <div style="font-size:0.8rem; color:#888;">$${p.price}</div>
                </div>
                <button onclick="deleteProduct('${p._id}')" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
                    Delete
                </button>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

// 6. NEW: DELETE PRODUCT
async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'x-access-token': token }
        });

        if (res.ok) {
            alert("Product deleted!");
            loadBaristaMenu(); // Refresh list
        } else {
            alert("Failed to delete.");
        }
    } catch (err) { alert("Error deleting product."); }
}
