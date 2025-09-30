const storage = require('../../fileStorage');

// Initialize storage once
let isStorageInitialized = false;
async function initializeStorage() {
  if (!isStorageInitialized) {
    await storage.initStorage();
    isStorageInitialized = true;
  }
}

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

  const { id } = req.query;

  try {
    // Initialize storage
    await initializeStorage();

    if (req.method === 'GET') {
      if (id) {
        // Get specific order
        const order = await storage.getOrderById(id);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      } else {
        // Get all orders
        const orders = await storage.getAllOrders();
        // Sort by order date descending
        const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        res.status(200).json(sortedOrders);
      }
    } else if (req.method === 'PATCH') {
      // Update order
      const updateData = {};
      
      if (req.body.customerName !== undefined) updateData.customerName = req.body.customerName;
      if (req.body.customerPhone !== undefined) updateData.customerPhone = req.body.customerPhone;
      if (req.body.fishType !== undefined) updateData.fishType = req.body.fishType;
      if (req.body.quantity !== undefined) updateData.quantity = parseFloat(req.body.quantity);
      if (req.body.pricePerKg !== undefined) updateData.pricePerKg = parseFloat(req.body.pricePerKg);
      if (req.body.status !== undefined) updateData.status = req.body.status;
      if (req.body.barcode !== undefined) updateData.barcode = req.body.barcode;
      
      const updatedOrder = await storage.updateOrder(id, updateData);
      res.status(200).json(updatedOrder);
    } else if (req.method === 'DELETE') {
      // Delete order
      const result = await storage.deleteOrder(id);
      res.status(200).json(result);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message });
  }
};