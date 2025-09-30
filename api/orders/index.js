const storage = require('../../fileStorage');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize storage
    await storage.initStorage();

    if (req.method === 'GET') {
      // Get all orders
      const orders = await storage.getAllOrders();
      // Sort by order date descending
      const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      res.status(200).json(sortedOrders);
    } else if (req.method === 'POST') {
      // Create new order
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
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message });
  }
};