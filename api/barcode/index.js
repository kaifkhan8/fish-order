const storage = require('../../fileStorage');
const QRCode = require('qrcode');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
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
      // Get all barcodes
      const barcodes = await storage.getAllBarcodes();
      // Sort by date added descending
      const sortedBarcodes = barcodes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      res.status(200).json(sortedBarcodes);
    } else if (req.method === 'POST') {
      if (req.url === '/generate-qrcode') {
        // Generate QR code
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
        
        res.status(200).json({
          barcodeId: newBarcode.id,
          barcodeValue: newBarcode.barcodeValue,
          qrCodeImage: qrCodeImage,
          fishType: newBarcode.fishType,
          pricePerKg: newBarcode.pricePerKg
        });
      } else {
        // Scan QR code
        const { barcodeValue } = req.body;
        
        const barcode = await storage.getBarcodeByValue(barcodeValue);
        
        if (!barcode) {
          return res.status(404).json({ message: 'Barcode not found' });
        }
        
        res.status(200).json(barcode);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: err.message });
  }
};