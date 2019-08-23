import { logger } from "./logger";
import { context } from "./context";

export function init() {
    return Promise.resolve()
    .then(() => {
        return context.init();
    })
    .then(() => {
        return logger.init();
    });
}

export * from "./context";
export * from "./logger";
export * from "./export";
export * from "./import";