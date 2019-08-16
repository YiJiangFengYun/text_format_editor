import * as log4js from "log4js";
import { context } from "./context";

const DEFAULT_CONFIG = {
    appenders: {
        console: { type: "console" },
        // stdout: { type: "stdout" },
        // stderr: { type: "stderr" },
        logfile: { type: "file", filename: "log.log" }
    },
    categories: {
        default: { appenders: ["console", /* "stdout", "stderr", */ "logfile"], level: "debug" },
    },
};

export const logger: {
    log: log4js.Logger;
    init: () => void;
    configureWithContext: () => void;
} = {
    log: null,
    init: function initLogger() {
        let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

        log4js.configure(config);

        this.log = log4js.getLogger();
        this.log.debug("Inited logger.");
    },

    configureWithContext: function () {
        let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

        config.categories.default.level == context.logLevel;

        this.log = this.log = log4js.getLogger();

        log4js.configure(config);
    }
}