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

  const { id } = req.query;

  try {
    // Initialize storage
    await initializeStorage();

    if (req.method === 'DELETE') {
      // Delete feedback
      const result = await storage.deleteFeedback(id);
      res.status(200).json(result);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message });
  }
};