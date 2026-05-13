const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// CRITICAL: Disable hardware acceleration to prevent rendering issues
app.disableHardwareAcceleration();

let mainWindow = null;
let backendServer = null;

// Comprehensive logging function
function log(message: string, data: any = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  if (data !== null) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  // Don't try to log to renderer during initialization to avoid loops
}

// Create splash screen
function createSplashWindow() {
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  
  splash.loadFile(path.join(__dirname, '..', 'assets', 'splash.html'));
  return splash;
}

// Start backend server if needed
function startBackendServer() {
  return new Promise<void>((resolve, reject) => {
    // Check if backend server exists and start it
    const serverPath = path.join(__dirname, '..', 'server', 'index.js');
    if (fs.existsSync(serverPath)) {
      backendServer = spawn('node', [serverPath], {
        stdio: 'pipe',
        detached: false
      });
      
      backendServer.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
        if (data.toString().includes('Server running')) {
          resolve();
        }
      });
      
      backendServer.on('error', (error) => {
        console.error('Failed to start backend:', error);
        reject(error);
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (backendServer) {
          resolve(); // Continue even if backend doesn't respond
        }
      }, 10000);
    } else {
      resolve(); // No backend server found, continue
    }
  });
}

async function createWindow() {
  const isDev = !app.isPackaged;
  
  log('=== ELECTRON STARTUP DEBUG ===');
  log('Creating main window');
  log('isDev:', isDev);
  log('__dirname:', __dirname);
  log('app.getPath(appData):', app.getPath('appData'));
  log('app.getAppPath():', app.getAppPath());
  log('process.cwd():', process.cwd());
  
  // Check if dist folder exists
  const distPath = path.join(__dirname, '..', 'dist');
  const distExists = fs.existsSync(distPath);
  log('dist path:', distPath);
  log('dist exists:', distExists);
  
  if (distExists) {
    const indexPath = path.join(distPath, 'index.html');
    log('index.html path:', indexPath);
    log('index.html exists:', fs.existsSync(indexPath));
    
    const assetsPath = path.join(distPath, 'assets');
    log('assets path:', assetsPath);
    log('assets exists:', fs.existsSync(assetsPath));
    
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      log('assets files:', files);
    }
  }
  
  // CRITICAL: Use safe window settings
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    maxWidth: 1920,
    maxHeight: 1080,
    frame: true,
    titleBarStyle: 'default',
    show: false, // Don't show until ready
    backgroundColor: '#0f0f0f', // Prevent white flash
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false, // Disable for local file loading
      allowRunningInsecureContent: true,
      experimentalFeatures: false,
      webgl: false, // Disable WebGL to prevent rendering issues
    },
  });
  
  log('BrowserWindow created successfully');

  // Set app title
  mainWindow.setTitle('Coffee Language POS System');

  // CRITICAL: Comprehensive error logging
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log('FAILED TO LOAD', { errorCode, errorDescription, validatedURL });
  });

  mainWindow.webContents.on('did-finish-load', () => {
    log('Page loaded successfully');
  });

  mainWindow.webContents.on('did-start-loading', () => {
    log('Started loading content');
  });

  mainWindow.webContents.on('did-stop-loading', () => {
    log('Stopped loading content');
  });

  mainWindow.webContents.on('dom-ready', () => {
    log('DOM is ready');
  });

  mainWindow.webContents.on('did-frame-finish-load', () => {
    log('Frame finished loading');
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    log('RENDER PROCESS CRASHED', details);
    console.error('Render process crashed:', details);
  });

  mainWindow.webContents.on('unresponsive', () => {
    log('Renderer became unresponsive');
  });

  mainWindow.webContents.on('responsive', () => {
    log('Renderer became responsive again');
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log(`Renderer Console [${level}]`, message);
  });

  mainWindow.webContents.on('crashed', (event, killed) => {
    log('RENDERER CRASHED', { killed });
  });

  // CRITICAL: Force open DevTools for debugging
  mainWindow.webContents.openDevTools();
  log('DevTools opened');

  // Show window when ready to prevent white screen
  mainWindow.once('ready-to-show', () => {
    log('Window ready to show');
    mainWindow.show();
    log('Window is now visible');
  });

  // Prevent navigation away from app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    log('Navigation attempt:', navigationUrl);
    if (navigationUrl.startsWith('http://localhost')) {
      return; // Allow localhost navigation
    }
    if (navigationUrl.startsWith('file://')) {
      return; // Allow file navigation
    }
    log('Navigation blocked:', navigationUrl);
    event.preventDefault();
  });

  // Security: prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    log('Window open attempt:', url);
    shell.openExternal(url);
    return { action: 'deny' };
  });

  try {
    // Load production build directly for more stable behavior
    // This avoids issues with Vite dev server in Electron
    const useProductionBuild = true;
    
    if (useProductionBuild || !isDev) {
      log('Production mode - loading local files...');
      // In production, __dirname points to app.asar/dist-electron
      // So ../dist/index.html points to app.asar/dist/index.html
      const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
      log('Loading production build from:', indexPath);
      
      // Check if file exists
      if (fs.existsSync(indexPath)) {
        log('Production index.html exists, loading...');
        await mainWindow.loadFile(indexPath);
      } else {
        log('Production index.html not found at:', indexPath);
        // Try alternative paths
        const altPaths = [
          path.join(__dirname, '..', '..', 'dist', 'index.html'),
          path.join(app.getAppPath(), 'dist', 'index.html'),
          path.join(process.cwd(), 'dist', 'index.html')
        ];
        
        for (const altPath of altPaths) {
          log('Trying alternative path:', altPath);
          if (fs.existsSync(altPath)) {
            log('Found file at:', altPath);
            await mainWindow.loadFile(altPath);
            break;
          }
        }
      }
    } else {
      log('Development mode - trying to connect to dev server...');
      // Try common development ports
      const ports = [5173, 5174, 5175, 5176, 5177, 5178];
      let loaded = false;
      
      for (const port of ports) {
        try {
          const url = `http://localhost:${port}`;
          log(`Trying port ${port}...`);
          await mainWindow.loadURL(url);
          log(`Successfully connected to port ${port}`);
          loaded = true;
          break;
        } catch (error) {
          log(`Port ${port} failed`, (error as Error).message);
        }
      }
      
      if (!loaded) {
        log('Dev server not available, falling back to production build...');
        // Fallback to production build
        const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
        log('Loading production build from:', indexPath);
        await mainWindow.loadFile(indexPath);
      }
    }
    
    log('Content loading initiated successfully');
  } catch (error) {
    log('Error loading content', (error as Error).message);
    log('Error details', error);
    // Create error page
    const errorHtml = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>Loading Error</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              background: #1a1a2e; 
              color: #eee;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .error { 
              background: #16213e; 
              padding: 30px; 
              border-radius: 12px; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            h2 { color: #e94560; margin-top: 0; }
            .error-details {
              background: rgba(233, 69, 96, 0.1);
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-family: monospace;
              font-size: 12px;
              text-align: left;
              direction: ltr;
            }
            button {
              background: #e94560;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              transition: background 0.3s;
            }
            button:hover {
              background: #d63850;
            }
          </style>
        </head>
        <body>
          <div class="error">
            <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
            <h2>خطأ في تحميل التطبيق</h2>
            <p>Application Loading Error</p>
            <div class="error-details">${(error as Error).message}</div>
            <button onclick="location.reload()">إعادة المحاولة / Retry</button>
          </div>
        </body>
      </html>
    `;
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
  }

  mainWindow.on('closed', () => {
    console.log('Main window closed');
    mainWindow = null;
    if (backendServer) {
      backendServer.kill();
    }
  });

  // Create menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'ملف',
      submenu: [
        {
          label: 'خروج',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        { label: 'تكبير', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: 'تصغير', accelerator: 'CmdOrCtrl+M', click: () => mainWindow.minimize() },
        { type: 'separator' },
        { label: 'إعادة تحميل', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.reload() }
      ]
    },
    {
      label: 'مساعدة',
      submenu: [
        {
          label: 'حول',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'حول',
              message: 'Coffee Language POS System',
              detail: 'نظام نق بيع متخصص للمقاهي العربية\nالإصدار: ' + app.getVersion()
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(async () => {
  // Initialize database directory
  initializeDatabaseDirectory();
  
  // Show splash screen
  const splash = createSplashWindow();
  
  try {
    // Start backend server if exists
    await startBackendServer();
    
    // Create main window
    createWindow();
    
    // Close splash screen after main window is ready
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) {
        splash.close();
      }
    }, 2000);
    
  } catch (error) {
    console.error('Startup error:', error);
    // Close splash and show error
    if (splash && !splash.isDestroyed()) {
      splash.close();
    }
    createWindow(); // Still try to show main window
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-path', () => {
  return app.getPath('appData');
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Database Files', extensions: ['db', 'sqlite', 'sqlite3'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return result;
});

ipcMain.handle('save-file', async (_, { content, filename }) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: filename,
    filters: [
      { name: 'Database Files', extensions: ['db'] },
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content);
    return result.filePath;
  }
  return null;
});

ipcMain.handle('read-file', async (_, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('write-file', async (_, { filePath, content }) => {
  try {
    fs.writeFileSync(filePath, content);
    return true;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('exists-file', async (_, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle('mkdir', async (_, dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('get-app-data-path', () => {
  return app.getPath('appData');
});

ipcMain.handle('open-external', async (_, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('print-receipt', async (_, { content, options }) => {
  if (!mainWindow) return false;
  
  const result = await mainWindow.webContents.print({
    silent: options.silent || false,
    printBackground: true,
    ...options,
  });
  
  return result;
});

// Database operations
ipcMain.handle('get-database-path', () => {
  return path.join(app.getPath('appData'), 'coffee-language-pos', 'database.db');
});

ipcMain.handle('backup-database', async (_, backupPath) => {
  try {
    const dbPath = path.join(app.getPath('appData'), 'coffee-language-pos', 'database.db');
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('restore-database', async (_, backupPath) => {
  try {
    const dbPath = path.join(app.getPath('appData'), 'coffee-language-pos', 'database.db');
    if (fs.existsSync(backupPath)) {
      // Ensure directory exists
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.copyFileSync(backupPath, dbPath);
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
});

// System info
ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    appVersion: app.getVersion(),
    appPath: app.getAppPath(),
    userDataPath: app.getPath('userData'),
  };
});

// App control
ipcMain.handle('minimize-app', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-app', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-app', () => {
  app.quit();
});

ipcMain.handle('restart-app', () => {
  app.relaunch();
  app.exit();
});

// Auto-update events (placeholder for future implementation)
ipcMain.handle('check-for-updates', async () => {
  // Placeholder for auto-update functionality
  return { hasUpdate: false, version: app.getVersion() };
});

// Initialize database directory
function initializeDatabaseDirectory() {
  const dbDir = path.join(app.getPath('appData'), 'coffee-language-pos');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}
