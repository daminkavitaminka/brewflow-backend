const API_URL = 'https://brewflow-api.onrender.com';
let token = localStorage.getItem('token');
let user = localStorage.getItem('user');
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    loadMenu();
    setupModalEvents();
});

function setupModalEvents() {
    
    document.getElementById('loginBtn').onclick = () => {
        document.getElementById('auth-modal').style.display = 'block';
        document.getElementById('login-box').style.display = 'block';
        document.getElementById('register-box').style.display = 'none';
    };


    document.querySelector('.close').onclick = () => document.getElementById('auth-modal').style.display = 'none';

 
    document.getElementById('show-register').onclick = (e) => {
        e.preventDefault();
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('register-box').style.display = 'block';
    };

    
    document.getElementById('show-login').onclick = (e) => {
        e.preventDefault();
        document.getElementById('register-box').style.display = 'none';
        document.getElementById('login-box').style.display = 'block';
    };


    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        await performAuth('/auth/login', { username, password });
    });

    
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

       
        const success = await performRegister({ username, email, password });
        if (success) {

            await performAuth('/auth/login', { username, password });
        }
    });

   
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.reload();
    };

    document.getElementById('ordersBtn').onclick = (e) => {
        e.preventDefault();
        document.getElementById('orders-modal').style.display = 'block';
        loadMyOrders();
    };
    document.querySelector('.close-orders').onclick = () => {
        document.getElementById('orders-modal').style.display = 'none';
    };
}

async function performRegister(data) {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (res.ok) {
            alert("Account created successfully!");
            return true;
        } else {
            alert('Registration Failed: ' + result.message);
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function performAuth(endpoint, payload) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.accessToken) {
            // 1. Save Credentials
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data));

            alert(`Welcome, ${data.username}!`);

            // 2. SMART REDIRECT (The new part)
            if (data.role === 'barista' || data.role === 'admin') {
                window.location.href = 'barista.html'; // Go to Staff Dashboard
            } else {
                location.reload(); // Stay on Menu (Customer)
            }

        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Login failed. Is the server running?");
    }
}

async function loadMenu() {
    const container = document.getElementById('menu-container');
    try {
        const res = await fetch(`${API_URL}/products`);
        allProducts = await res.json(); // Save to global variable
        renderMenu(allProducts); // Render everything initially
    } catch (err) {
        container.innerHTML = '<p>Error connecting to server.</p>';
    }
}

async function orderItem(productId) {
    if (!token) {
        alert("Please login to order coffee!");
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify({ items: [{ product: productId, quantity: 1 }] })
        });
        const data = await res.json();
        if (res.ok) alert("Order Placed! Status: " + data.order.status);
        else alert("Error: " + data.message);
    } catch (err) { alert("Something went wrong!"); }
}

function checkLoginState() {
    if (token) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('ordersBtn').style.display = 'block';
    }
}
function scrollToMenu() {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
}

async function loadMyOrders() {
    const container = document.getElementById('orders-history-container');
    try {
        const res = await fetch(`${API_URL}/orders/my-orders`, {
            headers: { 'x-access-token': token }
        });
        const orders = await res.json();

        if (orders.length === 0) {
            container.innerHTML = '<p style="text-align:center;">No orders yet. Go get some coffee!</p>';
            return;
        }

        container.innerHTML = orders.reverse().map(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const itemsList = order.items.map(i =>
                `<span>${i.quantity}x ${i.product ? i.product.name : 'Item'}</span>`
            ).join(', ');

            // Color code the status
            let color = '#d9534f'; // Red (Pending)
            if (order.status === 'brewing') color = '#f0ad4e'; // Orange
            if (order.status === 'ready') color = '#5cb85c';   // Green
            if (order.status === 'completed') color = '#333';  // Grey

            return `
            <div style="border-bottom:1px solid #eee; padding: 10px 0; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:bold; font-size:1.1rem;">$${order.totalAmount}</div>
                    <div style="font-size:0.85rem; color:#666;">${date} • ${itemsList}</div>
                </div>
                <div style="background:${color}; color:white; padding:4px 10px; border-radius:15px; font-size:0.8rem; text-transform:uppercase;">
                    ${order.status}
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p>Error loading history.</p>';
    }
}
function renderMenu(products) {
    const container = document.getElementById('menu-container');
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">No items found in this category.</p>';
        return;
    }
    container.innerHTML = products.map(product => `
        <div class="card">
            <div class="card-body">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <h3>${product.name}</h3>
                    <span class="price">$${product.price}</span>
                </div>
                <p style="color:#888; font-size:0.9rem;">${product.category}</p>
                <p>${product.description || "Freshly brewed goodness."}</p>
                <button class="btn-primary full-width" onclick="orderItem('${product._id}')" style="margin-top:1rem;">Add to Order +</button>
            </div>
        </div>
    `).join('');
}

function filterMenu(category) {
    // Update Buttons UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filter Logic
    if (category === 'all') {
        renderMenu(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderMenu(filtered);
    }
}