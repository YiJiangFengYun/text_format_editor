import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger";
import * as common from "../../common";
import { resourceRoot } from "./res_root";

const CONTEXT_CONFIG_PATH = path.join(resourceRoot.root, "build", "context.json");

export const context: {
    debug: boolean;
    logLevel: string;
    init: () => void;
} = {
    debug: false,
    logLevel: null,
    init: () => {
        return new Promise<void>((resolve, reject) => {
            logger.log.info("Initting the context.");
            fs.readFile(CONTEXT_CONFIG_PATH, "utf8", (err, data) => {
                if (err) return reject(err);
                let contextObj: common.Context = JSON.parse(data);
                context.debug = contextObj.debug;
                context.logLevel = contextObj.logLevel;
                logger.log.info("Inited the context.");
                resolve();
            });
        });
    }
}