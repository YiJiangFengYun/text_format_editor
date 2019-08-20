import * as formatText from "format_text";

export function init() {
    return Promise.resolve();
}

export class Model {
    public formatText: formatText.FormatText = new formatText.FormatText();

    public constructor() {

    }
}

export const model = new Model();