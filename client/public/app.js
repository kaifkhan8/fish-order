// Main application file for Rehman Fish Shop

// API base URL - for Vercel deployment, we'll use relative paths
const API_BASE = '/api';

// DOM Elements
const orderForm = document.getElementById('orderForm');
const feedbackForm = document.getElementById('feedbackForm');
const barcodeForm = document.getElementById('barcodeForm');
const ordersList = document.getElementById('ordersList');
const feedbackList = document.getElementById('feedbackList');
const barcodeList = document.getElementById('barcodeList');
const scannerContainer = document.getElementById('scannerContainer');
const qrCodeContainer = document.getElementById('qrCodeContainer');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    loadFeedback();
    loadBarcodes();
    
    // Event listeners
    if (orderForm) orderForm.addEventListener('submit', handleOrderSubmit);
    if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    if (barcodeForm) barcodeForm.addEventListener('submit', handleBarcodeSubmit);
    
    // Navigation
    setupNavigation();
});

// Set up navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            document.querySelectorAll('main > section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Handle order submission
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(orderForm);
    const orderData = {
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        fishType: formData.get('fishType'),
        quantity: parseFloat(formData.get('quantity')),
        pricePerKg: parseFloat(formData.get('pricePerKg')),
        barcode: formData.get('barcode') || null
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            showAlert('Order placed successfully!', 'success');
            orderForm.reset();
            loadOrders();
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showAlert(`Network error: ${error.message}`, 'error');
    }
}

// Handle feedback submission
async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(feedbackForm);
    const feedbackData = {
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment')
    };
    
    try {
        const response = await fetch(`${API_BASE}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });
        
        if (response.ok) {
            showAlert('Feedback submitted successfully!', 'success');
            feedbackForm.reset();
            loadFeedback();
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showAlert(`Network error: ${error.message}`, 'error');
    }
}

// Handle barcode generation
async function handleBarcodeSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(barcodeForm);
    const barcodeData = {
        fishType: formData.get('fishType'),
        pricePerKg: parseFloat(formData.get('pricePerKg')),
        description: formData.get('description')
    };
    
    try {
        const response = await fetch(`${API_BASE}/barcode/generate-qrcode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(barcodeData)
        });
        
        if (response.ok) {
            const result = await response.json();
            displayQRCode(result);
            loadBarcodes();
            showAlert('QR Code generated successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showAlert(`Network error: ${error.message}`, 'error');
    }
}

// Display QR Code
function displayQRCode(qrData) {
    if (qrCodeContainer) {
        qrCodeContainer.innerHTML = `
            <h3>QR Code for ${qrData.fishType}</h3>
            <img src="${qrData.qrCodeImage}" alt="QR Code" class="qr-code-image">
            <p>Price: ₹${qrData.pricePerKg.toFixed(2)} per kg</p>
            <p>Barcode ID: ${qrData.barcodeValue}</p>
        `;
    }
}

// Load orders from API
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        if (response.ok) {
            const orders = await response.json();
            displayOrders(orders);
        } else {
            console.error('Failed to load orders');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Display orders in the UI
function displayOrders(orders) {
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    ordersList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Fish Type</th>
                    <th>Quantity (kg)</th>
                    <th>Price/kg</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>${order.customerName}<br>${order.customerPhone}</td>
                        <td>${order.fishType}</td>
                        <td>${order.quantity}</td>
                        <td>₹${order.pricePerKg.toFixed(2)}</td>
                        <td>₹${order.totalPrice.toFixed(2)}</td>
                        <td>
                            <select onchange="updateOrderStatus('${order.id}', this.value)" 
                                    value="${order.status}">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadOrders();
        } else {
            showAlert('Failed to update order status', 'error');
        }
    } catch (error) {
        showAlert(`Network error: ${error.message}`, 'error');
    }
}

// Load feedback from API
async function loadFeedback() {
    try {
        const response = await fetch(`${API_BASE}/feedback`);
        if (response.ok) {
            const feedbacks = await response.json();
            displayFeedback(feedbacks);
        } else {
            console.error('Failed to load feedback');
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

// Display feedback in the UI
function displayFeedback(feedbacks) {
    if (!feedbackList) return;
    
    if (feedbacks.length === 0) {
        feedbackList.innerHTML = '<p>No feedback found.</p>';
        return;
    }
    
    feedbackList.innerHTML = feedbacks.map(feedback => `
        <div class="feedback-card">
            <div class="feedback-header">
                <span class="feedback-name">${feedback.customerName}</span>
                <span class="feedback-rating">
                    ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}
                </span>
            </div>
            <div class="feedback-email">${feedback.customerEmail || 'No email provided'}</div>
            <div class="feedback-comment">${feedback.comment}</div>
            <div class="feedback-date">${new Date(feedback.date).toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Load barcodes from API
async function loadBarcodes() {
    try {
        const response = await fetch(`${API_BASE}/barcode`);
        if (response.ok) {
            const barcodes = await response.json();
            displayBarcodes(barcodes);
        } else {
            console.error('Failed to load barcodes');
        }
    } catch (error) {
        console.error('Error loading barcodes:', error);
    }
}

// Display barcodes in the UI
function displayBarcodes(barcodes) {
    if (!barcodeList) return;
    
    if (barcodes.length === 0) {
        barcodeList.innerHTML = '<p>No barcodes found.</p>';
        return;
    }
    
    barcodeList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Fish Type</th>
                    <th>Price/kg</th>
                    <th>Description</th>
                    <th>Date Added</th>
                </tr>
            </thead>
            <tbody>
                ${barcodes.map(barcode => `
                    <tr>
                        <td>${barcode.fishType}</td>
                        <td>₹${barcode.pricePerKg.toFixed(2)}</td>
                        <td>${barcode.description || 'No description'}</td>
                        <td>${new Date(barcode.dateAdded).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Show alert message
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Barcode scanning functionality
function startBarcodeScanner() {
    if (!scannerContainer) return;
    
    scannerContainer.innerHTML = `
        <video id="scannerVideo" class="scanner-video"></video>
        <div class="scanner-controls">
            <button id="startScanner" class="btn">Start Scanner</button>
            <button id="stopScanner" class="btn">Stop Scanner</button>
        </div>
    `;
    
    const startBtn = document.getElementById('startScanner');
    const stopBtn = document.getElementById('stopScanner');
    const video = document.getElementById('scannerVideo');
    
    let stream = null;
    
    startBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "environment" } 
            });
            video.srcObject = stream;
            video.play();
            showAlert('Scanner started. Point camera at QR code.', 'success');
        } catch (err) {
            showAlert('Error accessing camera: ' + err.message, 'error');
        }
    });
    
    stopBtn.addEventListener('click', () => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            showAlert('Scanner stopped.', 'success');
        }
    });
}