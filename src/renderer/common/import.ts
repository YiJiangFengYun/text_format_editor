import * as electron from "electron";
import * as util from "../../util";
import * as model from "../model";

export class Import {
    public import(): Promise<boolean> {
        return electron.remote.dialog.showOpenDialog({
            title: "Import",
            buttonLabel: "Import",
            properties: ["openFile"]
        })
        .then((res) => {
            if (res.filePaths && res.filePaths.length > 0)
            {
                let filePath = res.filePaths[0];
                console.info(`Open file ${filePath}.`);
                return util.JsonIO.readJSON(filePath)
            } else {
                return null;
            }
        })
        .then((data) => {
            if (data) {
                console.info("Result imported is: " + JSON.stringify(data));
                model.model.formatText.init(data);
                return true;
            } else {
                return false;
            }
        });
    }
}

export const dataImport = new Import();