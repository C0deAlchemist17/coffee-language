// Electron API type declarations
export interface ElectronAPI {
  // App info
  appVersion(): Promise<string>;
  appPath(): Promise<string>;
  getAppDataPath(): Promise<string>;
  
  // File operations
  selectFile(): Promise<{ canceled: boolean; filePaths: string[] }>;
  saveFile(content: string, filename: string): Promise<string | null>;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<boolean>;
  existsFile(filePath: string): Promise<boolean>;
  mkdir(dirPath: string): Promise<boolean>;
  
  // External links
  openExternal(url: string): Promise<void>;
  
  // Printing
  printReceipt(content: string, options: any): Promise<boolean>;
  
  // Database operations
  getDatabasePath(): Promise<string>;
  backupDatabase(backupPath: string): Promise<boolean>;
  restoreDatabase(backupPath: string): Promise<boolean>;
  
  // System info
  getSystemInfo(): Promise<{
    platform: string;
    arch: string;
    nodeVersion: string;
    electronVersion: string;
    appVersion: string;
    appPath: string;
    userDataPath: string;
  }>;
  
  // App control
  minimizeApp(): Promise<void>;
  maximizeApp(): Promise<void>;
  closeApp(): Promise<void>;
  restartApp(): Promise<void>;
  
  // Events
  onAppUpdateAvailable(callback: () => void): void;
  onAppUpdateDownloaded(callback: () => void): void;
  removeAllListeners(channel: string): void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
