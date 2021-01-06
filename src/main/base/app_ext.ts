import { app } from "electron";

export const appExt = {
    init: () => {
        return new Promise<void>((resolve) => {
            // This method will be called when Electron has finished
            // initialization and is ready to create browser windows.
            // Some APIs can only be used after this event occurs.
            app.on('ready', () => {
                resolve();
            });
        });
    }
}