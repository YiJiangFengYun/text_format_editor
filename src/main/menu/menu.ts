import * as base from "../base";
import * as eventEmitter from "eventemitter3";
import * as electron from "electron";

export class Menu extends eventEmitter.EventEmitter {
    public static EVENT_INIT_PRE: string = "init_pre";
    public static EVENT_INIT_POST: string = "init_post";

    public template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
        {
            label: "File",
            id: "file",
            submenu: [
                { role: "quit", label: "Exit" }
            ]
        },
        {
            label: "Edit",
            id: "edit",
            submenu: [
                // { role: "undo" },
                // { role: "redo" },
            ]
        },
        {
            label: "View",
            id: "view",
            submenu: [
              { role: "reload" },
              { role: "forcereload" },
              { role: "toggledevtools" },
              { role: "resetzoom" },
              { role: "zoomin" },
              { role: "zoomout" },
              { type: "separator" },
              { role: "togglefullscreen" },
            ] as Electron.MenuItemConstructorOptions[],
        },
        {
            role: "help",
            submenu: [
                {
                    label: "About Editor",
                    click: null,
                }
            ]
        }
    ];

    public constructor() {
        super();
    }

    public init() {
        base.logger.log.info("Initing the menu.");
        this.emit(Menu.EVENT_INIT_PRE);
        const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = this.template;
        if (! base.context.debug) {
            let item = template.find((item) => {
                if ((item as Electron.MenuItemConstructorOptions).id === "view") {
                    return true;
                }
                return false;
            });
            let index = template.indexOf(item);
            template.splice(index, 1);
        }

        this._resetAppMenu();
        this.emit(Menu.EVENT_INIT_POST);
        base.logger.log.info("Inited the menu.");
    }

    private _resetAppMenu() {
        const menu = electron.Menu.buildFromTemplate(this.template);
        electron.Menu.setApplicationMenu(menu);
        //Hiden (remove) menu
        electron.Menu.setApplicationMenu(null);
    }
}

export const menu = new Menu();