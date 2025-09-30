# Troubleshooting Guide - White Page Issue

If you're seeing a white page when accessing `http://localhost:3000`, follow these steps to resolve the issue:

## 1. Check if the Server is Running

First, make sure the server is actually running:

1. Open Command Prompt or PowerShell
2. Navigate to the project directory: `cd c:\project\fish`
3. Run: `npm start`
4. You should see output like:
   ```
   Server is running on port 3000
   Open http://localhost:3000 in your browser to access the application
   File storage initialized
   ```

## 2. Verify Server Response

Test if the server is responding correctly:

1. Open a new Command Prompt or PowerShell window
2. Run: `Invoke-WebRequest -Uri http://localhost:3000 -Method GET`
3. You should see a StatusCode of 200 and HTML content

## 3. Browser Issues

If the server is running but you still see a white page:

1. **Clear Browser Cache**:
   - Press Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"

2. **Try a Different Browser**:
   - Try Chrome, Firefox, Edge, or another browser

3. **Check Browser Console**:
   - Press F12 to open Developer Tools
   - Go to the "Console" tab
   - Refresh the page
   - Look for any error messages

4. **Disable Browser Extensions**:
   - Some extensions might interfere with local development
   - Try opening in Incognito/Private mode

## 4. Port Issues

If port 3000 is already in use:

1. Stop any existing servers:
   - Run: `taskkill /f /im node.exe`

2. Try a different port:
   - Edit [server.js](file:///c%3A/project/fish/server.js)
   - Change `const PORT = process.env.PORT || 3000;` to `const PORT = process.env.PORT || 3001;`
   - Run: `npm start`
   - Access: `http://localhost:3001`

## 5. File Permissions

Make sure you have proper permissions:

1. Right-click on the project folder
2. Select "Properties"
3. Go to "Security" tab
4. Ensure your user account has "Full control"

## 6. Restart Everything

Sometimes a complete restart helps:

1. Close all terminals/command prompts
2. Close all browser windows
3. Restart the server:
   ```
   npm start
   ```
4. Open a new browser window and navigate to `http://localhost:3000`

## 7. Check Windows Firewall

Make sure Windows Firewall isn't blocking the connection:

1. Open Windows Security
2. Go to "Firewall & network protection"
3. Click "Allow an app through firewall"
4. Make sure Node.js is allowed

## 8. Reinstall Dependencies

If nothing else works:

1. Delete the `node_modules` folder
2. Run: `npm install`
3. Run: `npm start`

## 9. Contact Support

If you're still having issues:

1. Check the terminal where the server is running for error messages
2. Contact MD Kaif at mdkaif0611@gmail.com
3. Provide screenshots of:
   - The terminal output
   - Browser console errors (F12 → Console tab)
   - Network tab in browser developer tools

## Common Error Messages and Solutions

### "EADDRINUSE: address already in use"
- Another application is using port 3000
- Solution: Change the port or stop the other application

### "ENOENT: no such file or directory"
- A required file is missing
- Solution: Restart the server or reinstall dependencies

### "EACCES: permission denied"
- File permissions issue
- Solution: Check file permissions or run as administrator