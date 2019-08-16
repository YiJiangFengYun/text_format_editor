import { logger } from "./logger";
import { context } from "./context";
import { appExt } from "./app_ext";
import { window } from "./window"

export function init() {
    return Promise.resolve()
    .then(() => {
        return appExt.init();
    })
    .then(() => {
        return logger.init();
    })
    .then(() => {
        return context.init();
    })
    .then(() => {
        return logger.configureWithContext();
    })
    .then(() => {
        return window.init();
    });
}

export * from "./app_ext";
export * from "./context";
export * from "./logger";
export * from "./res_root";
export * from "./window";