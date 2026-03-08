const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onFileOpened: (callback) => ipcRenderer.on('file-opened', (event, value) => callback(value)),
    onFileNew: (callback) => ipcRenderer.on('file-new', () => callback()),
    onRequestSave: (callback) => ipcRenderer.on('request-save', () => callback()),
    saveFile: (content) => ipcRenderer.send('save-file', content)
});