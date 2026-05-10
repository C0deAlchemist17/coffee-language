const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    appVersion: () => ipcRenderer.invoke('app-version'),
    appPath: () => ipcRenderer.invoke('app-path'),
    selectFile: () => ipcRenderer.invoke('select-file'),
    saveFile: (content, filename) => ipcRenderer.invoke('save-file', { content, filename }),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('write-file', { filePath, content }),
    existsFile: (filePath) => ipcRenderer.invoke('exists-file', filePath),
    mkdir: (dirPath) => ipcRenderer.invoke('mkdir', dirPath),
    getAppDataPath: () => ipcRenderer.invoke('get-app-data-path'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    printReceipt: (content, options) => ipcRenderer.invoke('print-receipt', { content, options }),
});
