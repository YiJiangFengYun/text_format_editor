import { tempController } from "./temp";

export function init() {
    return Promise.resolve()
    .then(() => {
        return tempController.init();
    });
}