// Setup script for Rehman Fish Shop Application
const mongoose = require('mongoose');
const Barcode = require('./models/Barcode');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rehmanfish', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Check if we have any barcodes, if not, add some sample data
  const barcodeCount = await Barcode.countDocuments();
  
  if (barcodeCount === 0) {
    console.log('Adding sample barcode data...');
    
    const sampleBarcodes = [
      {
        barcodeValue: 'ROHU-001',
        fishType: 'Rohu',
        pricePerKg: 180,
        description: 'Freshwater fish, rich in protein'
      },
      {
        barcodeValue: 'KATLA-001',
        fishType: 'Katla',
        pricePerKg: 200,
        description: 'Large freshwater carp'
      },
      {
        barcodeValue: 'HILSA-001',
        fishType: 'Hilsa',
        pricePerKg: 450,
        description: 'Premium saltwater fish, known as the king of fish'
      }
    ];
    
    try {
      await Barcode.insertMany(sampleBarcodes);
      console.log('Sample barcodes added successfully');
    } catch (err) {
      console.error('Error adding sample barcodes:', err);
    }
  } else {
    console.log(`Found ${barcodeCount} existing barcodes in database`);
  }
  
  console.log('Setup completed successfully!');
  mongoose.connection.close();
});