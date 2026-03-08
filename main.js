const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');

    // Створення меню
    const menuTemplate = [
        {
            label: 'Файл',
            submenu: [
                {
                    label: 'Новий файл',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow.webContents.send('file-new')
                },
                {
                    label: 'Відкрити',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => openFile()
                },
                {
                    label: 'Зберегти',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow.webContents.send('request-save')
                },
                { type: 'separator' },
                {
                    label: 'Вихід',
                    click: () => app.quit()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}

// Функція відкриття файлу
async function openFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'js', 'html'] }]
    });

    if (!canceled) {
        const content = fs.readFileSync(filePaths[0], 'utf-8');
        mainWindow.webContents.send('file-opened', content);
    }
}

// Обробка збереження (отримуємо дані від рендерера)
ipcMain.on('save-file', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        filters: [{ name: 'Text File', extensions: ['txt'] }]
    });

    if (!canceled && filePath) {
        fs.writeFileSync(filePath, content);
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});