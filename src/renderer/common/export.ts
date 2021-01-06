import * as electron from "electron";
import * as path from "path";
import * as log from 'loglevel';
import * as util from "../../util";
import * as model from "../model";

export class Export {
    public export() {
        return electron.remote.dialog.showSaveDialog({
            title: "Export",
            defaultPath: path.join(electron.remote.app.getPath("desktop"), "data.json"),
            buttonLabel: "Export",
        })
        .then((res) => {
            if (res.filePath && ! res.canceled) {
                let filePath = res.filePath;
                let data = model.model.formatText.data;
                log.info("Result exported is: " + JSON.stringify(data));
                return util.JsonIO.writeJSON(filePath, data);
            } else {
                return null;
            }
        });
    }
}

export const dataExport = new Export();