const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  appVersion: () => ipcRenderer.invoke('app-version'),
  appPath: () => ipcRenderer.invoke('app-path'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (content: string, filename: string) => ipcRenderer.invoke('save-file', { content, filename }),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', { filePath, content }),
  existsFile: (filePath: string) => ipcRenderer.invoke('exists-file', filePath),
  mkdir: (dirPath: string) => ipcRenderer.invoke('mkdir', dirPath),
  getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  printReceipt: (content: string, options: any) => ipcRenderer.invoke('print-receipt', { content, options }),
});
