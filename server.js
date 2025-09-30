const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const storage = require('./fileStorage');

// Import QR code library
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/public')));

// Initialize file storage
storage.initStorage().then(() => {
  console.log('File storage initialized');
}).catch(err => {
  console.error('Error initializing file storage:', err);
});

// Orders API
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await storage.getAllOrders();
    // Sort by order date descending
    const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    res.json(sortedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await storage.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = {
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      fishType: req.body.fishType,
      quantity: parseFloat(req.body.quantity),
      pricePerKg: parseFloat(req.body.pricePerKg),
      totalPrice: parseFloat(req.body.quantity) * parseFloat(req.body.pricePerKg),
      status: 'pending',
      barcode: req.body.barcode || null
    };
    
    const newOrder = await storage.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const updateData = {};
    
    if (req.body.customerName !== undefined) updateData.customerName = req.body.customerName;
    if (req.body.customerPhone !== undefined) updateData.customerPhone = req.body.customerPhone;
    if (req.body.fishType !== undefined) updateData.fishType = req.body.fishType;
    if (req.body.quantity !== undefined) updateData.quantity = parseFloat(req.body.quantity);
    if (req.body.pricePerKg !== undefined) updateData.pricePerKg = parseFloat(req.body.pricePerKg);
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.barcode !== undefined) updateData.barcode = req.body.barcode;
    
    const updatedOrder = await storage.updateOrder(req.params.id, updateData);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const result = await storage.deleteOrder(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Feedback API
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await storage.getAllFeedback();
    // Sort by date descending
    const sortedFeedbacks = feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedFeedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const feedbackData = {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      rating: parseInt(req.body.rating),
      comment: req.body.comment
    };
    
    const newFeedback = await storage.createFeedback(feedbackData);
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const result = await storage.deleteFeedback(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Barcode API
app.get('/api/barcode', async (req, res) => {
  try {
    const barcodes = await storage.getAllBarcodes();
    // Sort by date added descending
    const sortedBarcodes = barcodes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    res.json(sortedBarcodes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/barcode/generate-qrcode', async (req, res) => {
  try {
    const barcodeData = {
      fishType: req.body.fishType,
      pricePerKg: parseFloat(req.body.pricePerKg),
      description: req.body.description
    };
    
    const newBarcode = await storage.createBarcode(barcodeData);
    
    // Generate QR code
    const qrCodeData = JSON.stringify({
      id: newBarcode.id,
      fishType: newBarcode.fishType,
      pricePerKg: newBarcode.pricePerKg,
      description: newBarcode.description
    });
    
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    
    res.json({
      barcodeId: newBarcode.id,
      barcodeValue: newBarcode.barcodeValue,
      qrCodeImage: qrCodeImage,
      fishType: newBarcode.fishType,
      pricePerKg: newBarcode.pricePerKg
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/barcode/scan', async (req, res) => {
  try {
    const { barcodeValue } = req.body;
    
    const barcode = await storage.getBarcodeByValue(barcodeValue);
    
    if (!barcode) {
      return res.status(404).json({ message: 'Barcode not found' });
    }
    
    res.json(barcode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'client/public')));

// Catch-all handler: serve the main HTML file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/order.html'));
});

// For Vercel deployment, we need to export the app
module.exports = app;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to access the application`);
  });
}