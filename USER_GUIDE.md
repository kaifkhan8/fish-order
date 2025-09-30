# Rehman Fish Shop - User Guide

## Getting Started

1. Make sure you have Node.js installed on your computer
2. Double-click on [start-app.bat](file:///c%3A/project/fish/start-app.bat) to start the application
3. Open your web browser and go to `http://localhost:3000`

## Application Features

### 1. Place Order
- Navigate to the "Place Order" page
- Fill in customer information (name and phone number)
- Select fish type from the dropdown or enter a custom type
- Enter quantity in kilograms
- Enter price per kilogram
- Optionally scan a QR code for fish information
- Click "Place Order"

### 2. View Orders
- Navigate to the "View Orders" page
- See all orders in a table format
- Update order status using the dropdown menus:
  - Pending (default)
  - Confirmed
  - Delivered
  - Cancelled

### 3. Feedback System
- Navigate to the "Feedback" page
- Customers can submit feedback by filling out the form:
  - Enter name
  - Optionally enter email
  - Select a rating (1-5 stars)
  - Enter comments
  - Click "Submit Feedback"
- All feedback is displayed below the form

### 4. Barcode System
- Navigate to the "Barcode Scanner" page
- To generate a QR code:
  - Enter fish type
  - Enter price per kilogram
  - Optionally add a description
  - Click "Generate QR Code"
  - The QR code will appear on screen
- To scan a QR code:
  - On a mobile device, click "Start Scanner"
  - Point the camera at a QR code
  - The information will be automatically filled in the order form

## Data Storage

All data is stored in JSON files in the [data](file:///c%3A/project/fish/data) folder:
- [orders.json](file:///c%3A/project/fish/data/orders.json) - Contains all order information
- [feedback.json](file:///c%3A/project/fish/data/feedback.json) - Contains all customer feedback
- [barcodes.json](file:///c%3A/project/fish/data/barcodes.json) - Contains all fish item barcodes

## Troubleshooting

If you encounter any issues, please refer to our [Troubleshooting Guide](file:///c%3A/project/fish/TROUBLESHOOTING.md) for solutions to common problems.

## Technical Information

### Application Structure
- Backend: Node.js with Express.js
- Frontend: HTML, CSS, JavaScript
- Storage: File-based JSON storage
- QR Codes: Generated using the qrcode.js library

### API Endpoints
- Orders: `/api/orders`
- Feedback: `/api/feedback`
- Barcodes: `/api/barcode`

### Customization
You can customize the fish types in the order form by modifying the HTML select element in [client/public/order.html](file:///c%3A/project/fish/client/public/order.html).

## Support

For support, contact MD Kaif at mdkaif0611@gmail.com