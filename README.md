# Rehman Fish Shop Ordering Application

A comprehensive web application for Rehman Fish Shop to manage customer orders, feedback, and barcode scanning for fish items.

## Features

1. **Customer Order Management**
   - Place new fish orders with customer details
   - View and manage all orders
   - Update order status (pending, confirmed, delivered, cancelled)

2. **Feedback System**
   - Customers can submit feedback with ratings
   - View all customer feedback

3. **Barcode Scanning**
   - Generate QR codes for fish items with pricing
   - Scan QR codes to quickly add items to orders
   - Manage barcode database

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express.js
- **Storage**: 
  - File-based JSON storage for local development
  - In-memory storage for Vercel deployment
- **Barcode/QR**: QRCode.js library

## Installation

1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Placing Orders
1. Navigate to the "Place Order" page
2. Fill in customer details and fish order information
3. Optionally scan a QR code for fish type and pricing
4. Submit the order

### Managing Orders
1. Go to the "View Orders" page
2. See all orders in a table format
3. Update order status using the dropdown menus

### Feedback System
1. Customers can submit feedback on the "Feedback" page
2. View all feedback submissions on the same page

### Barcode System
1. Generate QR codes for fish items on the "Barcode Scanner" page
2. Scan QR codes using the camera functionality (works on mobile devices)
3. View all existing barcodes

## File Structure

```
rehman-fish-app/
├── client/
│   └── public/
│       ├── index.html
│       ├── order.html
│       ├── view-orders.html
│       ├── feedback.html
│       ├── barcode.html
│       ├── styles.css
│       └── app.js
├── data/
│   ├── orders.json
│   ├── feedback.json
│   └── barcodes.json
├── api/
│   ├── orders/
│   │   ├── index.js
│   │   └── [id].js
│   ├── feedback/
│   │   ├── index.js
│   │   └── [id].js
│   └── barcode/
│       └── index.js
├── fileStorage.js
├── server.js
├── package.json
├── vercel.json
├── README.md
├── start-app.bat
└── dev-start.bat
```

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create a new order
- `PATCH /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit new feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Barcode
- `GET /api/barcode` - Get all barcodes
- `POST /api/barcode/generate-qrcode` - Generate a new QR code
- `POST /api/barcode/scan` - Scan a QR code

## Vercel Deployment

This application is configured for deployment on Vercel with:
- Serverless functions for API endpoints
- Static file serving for the frontend
- In-memory storage for Vercel's read-only environment
- File-based storage for local development

**Note**: Data persistence on Vercel is limited as serverless functions are ephemeral. For production use with data persistence, consider migrating to a database solution.

## Author

MD Kaif

## License

MIT