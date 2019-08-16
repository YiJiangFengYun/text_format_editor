import { menu } from "./menu";

export function init() {
    return Promise.resolve()
    .then(() => {
        return menu.init();
    });
}

export * from "./menu";