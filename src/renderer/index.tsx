import * as log from "loglevel";
import * as ReactDOM from "react-dom";
import * as React from "react";
import * as common from "./common";
import * as model from "./model";
import * as controller from "./controller";
import * as view from "./view";

Promise.resolve()
.then(() => {
    return common.init();
})
.then(() => {
    return model.init();
})
.then(() => {
    return controller.init();
})
.then(() => {
    ReactDOM.render(
        <view.App />,
        document.getElementById('root')
      );
})
.then(() => {
    log.info("Inited the renderer process.");
})
.catch((err) => {
    log.error("Error to init the renderer process.");
    log.error(err);
});
