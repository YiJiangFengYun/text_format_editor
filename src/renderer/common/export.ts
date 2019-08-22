import * as electron from "electron";
import * as path from "path";
import * as util from "../../util";
import * as model from "../model";

const DEFAULT_PATH = path.join(electron.remote.app.getPath("desktop"), "data.json");

export class Export {
    public export() {
        return electron.remote.dialog.showSaveDialog({
            title: "Export",
            defaultPath: DEFAULT_PATH,
            buttonLabel: "Export",
        })
        .then((res) => {
            if (res.filePath && ! res.canceled) {
                let filePath = res.filePath;
                let data = model.model.formatText.data;
                console.info("Result exported is: " + JSON.stringify(data));
                return util.JsonIO.writeJSON(filePath, data);
            } else {
                return null;
            }
        });
    }
}

export const dataExport = new Export();