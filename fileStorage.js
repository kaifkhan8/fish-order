// Storage system for Rehman Fish Shop Application
// Uses file storage for local development and in-memory storage for Vercel deployment

const fs = require('fs').promises;
const path = require('path');

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined;

// Storage implementations
let ordersStorage = [];
let feedbackStorage = [];
let barcodesStorage = [];

// Ensure data directory exists (only for local development)
const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const feedbackFile = path.join(dataDir, 'feedback.json');
const barcodesFile = path.join(dataDir, 'barcodes.json');

// Initialize storage files (only for local development)
async function initFileStorage() {
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

// Load data from files (only for local development)
async function loadFromFile() {
    try {
        const ordersData = await fs.readFile(ordersFile, 'utf8');
        ordersStorage = JSON.parse(ordersData || '[]');
        
        const feedbackData = await fs.readFile(feedbackFile, 'utf8');
        feedbackStorage = JSON.parse(feedbackData || '[]');
        
        const barcodesData = await fs.readFile(barcodesFile, 'utf8');
        barcodesStorage = JSON.parse(barcodesData || '[]');
    } catch (err) {
        console.error('Error loading data from files:', err);
        // Initialize with empty arrays if files don't exist
        ordersStorage = [];
        feedbackStorage = [];
        barcodesStorage = [];
    }
}

// Save data to files (only for local development)
async function saveToFile() {
    try {
        if (!isVercel) {
            await fs.writeFile(ordersFile, JSON.stringify(ordersStorage, null, 2));
            await fs.writeFile(feedbackFile, JSON.stringify(feedbackStorage, null, 2));
            await fs.writeFile(barcodesFile, JSON.stringify(barcodesStorage, null, 2));
        }
    } catch (err) {
        console.error('Error saving data to files:', err);
    }
}

// Generate a simple ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize storage
async function initStorage() {
    if (isVercel) {
        // On Vercel, initialize with sample data in memory
        if (barcodesStorage.length === 0) {
            barcodesStorage = [
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
        }
    } else {
        // Local development - use file storage
        await initFileStorage();
        await loadFromFile();
    }
}

// Orders functions
async function getAllOrders() {
    return [...ordersStorage];
}

async function getOrderById(id) {
    return ordersStorage.find(order => order.id === id);
}

async function createOrder(orderData) {
    const newOrder = {
        id: generateId(),
        ...orderData,
        orderDate: new Date().toISOString()
    };
    ordersStorage.push(newOrder);
    await saveToFile();
    return newOrder;
}

async function updateOrder(id, updateData) {
    const orderIndex = ordersStorage.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
        throw new Error('Order not found');
    }
    
    ordersStorage[orderIndex] = {
        ...ordersStorage[orderIndex],
        ...updateData,
        // Recalculate total if quantity or price changes
        ...(updateData.quantity || updateData.pricePerKg) && {
            totalPrice: (updateData.quantity || ordersStorage[orderIndex].quantity) * 
                       (updateData.pricePerKg || ordersStorage[orderIndex].pricePerKg)
        }
    };
    
    await saveToFile();
    return ordersStorage[orderIndex];
}

async function deleteOrder(id) {
    ordersStorage = ordersStorage.filter(order => order.id !== id);
    await saveToFile();
    return { message: 'Order deleted' };
}

// Feedback functions
async function getAllFeedback() {
    return [...feedbackStorage];
}

async function createFeedback(feedbackData) {
    const newFeedback = {
        id: generateId(),
        ...feedbackData,
        date: new Date().toISOString()
    };
    feedbackStorage.push(newFeedback);
    await saveToFile();
    return newFeedback;
}

async function deleteFeedback(id) {
    feedbackStorage = feedbackStorage.filter(feedback => feedback.id !== id);
    await saveToFile();
    return { message: 'Feedback deleted' };
}

// Barcode functions
async function getAllBarcodes() {
    return [...barcodesStorage];
}

async function getBarcodeByValue(barcodeValue) {
    return barcodesStorage.find(barcode => barcode.barcodeValue === barcodeValue);
}

async function createBarcode(barcodeData) {
    const newBarcode = {
        id: generateId(),
        barcodeValue: `${barcodeData.fishType}-${Date.now()}`,
        ...barcodeData,
        dateAdded: new Date().toISOString()
    };
    barcodesStorage.push(newBarcode);
    await saveToFile();
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