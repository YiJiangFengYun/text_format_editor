import * as electron from "electron";
import { logger } from "./logger";
import { context } from "./context";

export const window: {
    mainWindow: electron.BrowserWindow;
    init: () => void;
} = {
    mainWindow: null,
    init: function () {
        let mainWindow: electron.BrowserWindow;
        
        function createWindow() {
            // Create the browser window.
            mainWindow = new electron.BrowserWindow({
                width: 1000,
                height: 800,
                // resizable: false,
                show: false,
                webPreferences: {
                    nodeIntegration: true
                },
            });
        
            // and load the index.html of the app.
            mainWindow.loadFile('index.html');
        
            mainWindow.once("ready-to-show", () => {
                mainWindow.show();
            })
        
            // Open the DevTools.
            if (context.debug) {
                mainWindow.webContents.openDevTools();
            }
        
            // Emitted when the window is closed.
            mainWindow.on('closed', function () {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                mainWindow = null;
            })
        }
        
        // Quit when all windows are closed.
        electron.app.on('window-all-closed', function () {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                electron.app.quit();
            }
        })
        
        electron.app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) {
                createWindow();
            }
        });

        createWindow();
        
        logger.log.debug("Inited window.");
    }
}
