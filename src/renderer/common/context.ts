import * as log from "loglevel";
import axios from "axios";

const CONTEXT_CONFIG_PATH = "build/context.json";

export const context: {
    logLevel: string;
    init: () => void;
} = {
    logLevel: null,
    init: () => {
        return Promise.resolve()
        .then(() => {
            log.info("Initing the context.");
        })
        .then(() => {
            return axios.get(CONTEXT_CONFIG_PATH);
        })
        .then((res) => {
            context.logLevel = res.data.logLevel;
        })
        .then(() => {
            log.info("Inited the context.");
        });
    }
}