import * as log from "loglevel";
import axios from "axios";
import * as modCommon from "../../common";

const CONTEXT_CONFIG_PATH = "build/context.json";

export const context: modCommon.Context &  {
    init: () => Promise<void>;
} = {
    init(): Promise<void> {
        return Promise.resolve()
        .then(() => {
            log.info("Initing the context.");
        })
        .then(() => {
            return axios.get(CONTEXT_CONFIG_PATH);
        })
        .then((res) => {
            Object.assign(this, res.data);
        })
        .then(() => {
            log.info("Inited the context.");
        });
    }
}