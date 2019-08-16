import * as base from "./base";
import * as menu from "./menu";

Promise.resolve()
.then(() => {
    return base.init();
})
.then(() => {
    return menu.init();
})
.then(() => {
    return base.logger.log.info("Inited the main process.");
})
.catch((err) => {
    base.logger.log.error(err);
});