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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize storage
    await initializeStorage();

    if (req.method === 'GET') {
      // Get all feedback
      const feedbacks = await storage.getAllFeedback();
      // Sort by date descending
      const sortedFeedbacks = feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));
      res.status(200).json(sortedFeedbacks);
    } else if (req.method === 'POST') {
      // Create new feedback
      const feedbackData = {
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        rating: parseInt(req.body.rating),
        comment: req.body.comment
      };
      
      const newFeedback = await storage.createFeedback(feedbackData);
      res.status(201).json(newFeedback);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message });
  }
};