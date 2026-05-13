const { contextBridge, ipcRenderer } = require('electron');

// CRITICAL: Add logging to preload
console.log('=== PRELOAD SCRIPT LOADED ===');
console.log('Preload contextBridge available');
console.log('IPC renderer available');

// Validate and sanitize inputs
const validateInput = (input: any, type: string): boolean => {
  if (typeof input !== type) return false;
  if (typeof input === 'string' && input.length > 10000) return false; // Prevent huge strings
  return true;
};

console.log('Creating electronAPI bridge...');

contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  appVersion: () => ipcRenderer.invoke('app-version'),
  appPath: () => ipcRenderer.invoke('app-path'),
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  
  // File operations (with validation)
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (content: string, filename: string) => {
    if (!validateInput(content, 'string') || !validateInput(filename, 'string')) {
      return Promise.reject(new Error('Invalid input'));
    }
    return ipcRenderer.invoke('save-file', { content, filename });
  },
  readFile: (filePath: string) => {
    if (!validateInput(filePath, 'string')) {
      return Promise.reject(new Error('Invalid file path'));
    }
    return ipcRenderer.invoke('read-file', filePath);
  },
  writeFile: (filePath: string, content: string) => {
    if (!validateInput(filePath, 'string') || !validateInput(content, 'string')) {
      return Promise.reject(new Error('Invalid input'));
    }
    return ipcRenderer.invoke('write-file', { filePath, content });
  },
  existsFile: (filePath: string) => {
    if (!validateInput(filePath, 'string')) {
      return Promise.reject(new Error('Invalid file path'));
    }
    return ipcRenderer.invoke('exists-file', filePath);
  },
  mkdir: (dirPath: string) => {
    if (!validateInput(dirPath, 'string')) {
      return Promise.reject(new Error('Invalid directory path'));
    }
    return ipcRenderer.invoke('mkdir', dirPath);
  },
  
  // External links
  openExternal: (url: string) => {
    if (!validateInput(url, 'string') || !url.startsWith('http')) {
      return Promise.reject(new Error('Invalid URL'));
    }
    return ipcRenderer.invoke('open-external', url);
  },
  
  // Printing
  printReceipt: (content: string, options: any) => {
    if (!validateInput(content, 'string')) {
      return Promise.reject(new Error('Invalid content'));
    }
    return ipcRenderer.invoke('print-receipt', { content, options });
  },
  
  // Database operations
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  backupDatabase: (backupPath: string) => {
    if (!validateInput(backupPath, 'string')) {
      return Promise.reject(new Error('Invalid backup path'));
    }
    return ipcRenderer.invoke('backup-database', backupPath);
  },
  restoreDatabase: (backupPath: string) => {
    if (!validateInput(backupPath, 'string')) {
      return Promise.reject(new Error('Invalid backup path'));
    }
    return ipcRenderer.invoke('restore-database', backupPath);
  },
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // App control
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
  maximizeApp: () => ipcRenderer.invoke('maximize-app'),
  closeApp: () => ipcRenderer.invoke('close-app'),
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Events
  onAppUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on('app-update-available', callback);
  },
  onAppUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('app-update-downloaded', callback);
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

console.log('electronAPI bridge created successfully');
console.log('=== PRELOAD SCRIPT COMPLETE ===');

// Security: Prevent prototype pollution
// Note: This runs in preload context, window is not available here
