const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startServer } = require('./server.cjs');
const isDev = require('electron-is-dev');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '..', 'public', 'vite.svg')
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    // In dev, load the Vite dev server directly. 
    // Make sure 'npm run dev' is running on port 5173.
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, start the Express server and serve the built 'dist'
    const userDataPath = app.getPath('userData');
    const localUrl = await startServer(userDataPath, isDev);
    mainWindow.loadURL(localUrl);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
