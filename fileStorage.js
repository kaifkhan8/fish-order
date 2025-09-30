// Simple file-based storage system for Rehman Fish Shop Application
const fs = require('fs').promises;
const path = require('path');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const feedbackFile = path.join(dataDir, 'feedback.json');
const barcodesFile = path.join(dataDir, 'barcodes.json');

// Initialize storage files
async function initStorage() {
    try {
        await fs.access(dataDir);
    } catch (err) {
        await fs.mkdir(dataDir);
    }
    
    // Create files if they don't exist
    const files = [ordersFile, feedbackFile, barcodesFile];
    for (const file of files) {
        try {
            await fs.access(file);
        } catch (err) {
            await fs.writeFile(file, JSON.stringify([]));
        }
    }
    
    // Add sample barcodes if file is empty
    const barcodesData = await fs.readFile(barcodesFile, 'utf8');
    if (barcodesData === '[]' || barcodesData === '') {
        const sampleBarcodes = [
            {
                id: generateId(),
                barcodeValue: 'ROHU-001',
                fishType: 'Rohu',
                pricePerKg: 180,
                description: 'Freshwater fish, rich in protein',
                dateAdded: new Date().toISOString()
            },
            {
                id: generateId(),
                barcodeValue: 'KATLA-001',
                fishType: 'Katla',
                pricePerKg: 200,
                description: 'Large freshwater carp',
                dateAdded: new Date().toISOString()
            },
            {
                id: generateId(),
                barcodeValue: 'HILSA-001',
                fishType: 'Hilsa',
                pricePerKg: 450,
                description: 'Premium saltwater fish, known as the king of fish',
                dateAdded: new Date().toISOString()
            }
        ];
        await fs.writeFile(barcodesFile, JSON.stringify(sampleBarcodes, null, 2));
    }
}

// Generate a simple ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Read data from file
async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        return [];
    }
}

// Write data to file
async function writeData(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Orders functions
async function getAllOrders() {
    return await readData(ordersFile);
}

async function getOrderById(id) {
    const orders = await getAllOrders();
    return orders.find(order => order.id === id);
}

async function createOrder(orderData) {
    const orders = await getAllOrders();
    const newOrder = {
        id: generateId(),
        ...orderData,
        orderDate: new Date().toISOString()
    };
    orders.push(newOrder);
    await writeData(ordersFile, orders);
    return newOrder;
}

async function updateOrder(id, updateData) {
    const orders = await getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
        throw new Error('Order not found');
    }
    
    orders[orderIndex] = {
        ...orders[orderIndex],
        ...updateData,
        // Recalculate total if quantity or price changes
        ...(updateData.quantity || updateData.pricePerKg) && {
            totalPrice: (updateData.quantity || orders[orderIndex].quantity) * 
                       (updateData.pricePerKg || orders[orderIndex].pricePerKg)
        }
    };
    
    await writeData(ordersFile, orders);
    return orders[orderIndex];
}

async function deleteOrder(id) {
    const orders = await getAllOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    await writeData(ordersFile, filteredOrders);
    return { message: 'Order deleted' };
}

// Feedback functions
async function getAllFeedback() {
    return await readData(feedbackFile);
}

async function createFeedback(feedbackData) {
    const feedbacks = await getAllFeedback();
    const newFeedback = {
        id: generateId(),
        ...feedbackData,
        date: new Date().toISOString()
    };
    feedbacks.push(newFeedback);
    await writeData(feedbackFile, feedbacks);
    return newFeedback;
}

async function deleteFeedback(id) {
    const feedbacks = await getAllFeedback();
    const filteredFeedbacks = feedbacks.filter(feedback => feedback.id !== id);
    await writeData(feedbackFile, filteredFeedbacks);
    return { message: 'Feedback deleted' };
}

// Barcode functions
async function getAllBarcodes() {
    return await readData(barcodesFile);
}

async function getBarcodeByValue(barcodeValue) {
    const barcodes = await getAllBarcodes();
    return barcodes.find(barcode => barcode.barcodeValue === barcodeValue);
}

async function createBarcode(barcodeData) {
    const barcodes = await getAllBarcodes();
    const newBarcode = {
        id: generateId(),
        barcodeValue: `${barcodeData.fishType}-${Date.now()}`,
        ...barcodeData,
        dateAdded: new Date().toISOString()
    };
    barcodes.push(newBarcode);
    await writeData(barcodesFile, barcodes);
    return newBarcode;
}

module.exports = {
    initStorage,
    // Orders
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    // Feedback
    getAllFeedback,
    createFeedback,
    deleteFeedback,
    // Barcodes
    getAllBarcodes,
    getBarcodeByValue,
    createBarcode
};