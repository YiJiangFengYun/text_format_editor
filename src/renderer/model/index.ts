import * as modFormatText from "format_text";

export function init() {
    return Promise.resolve();
}

export class Model {
    public formatText: modFormatText.FormatText = new modFormatText.FormatText();

    public constructor() {
        this.formatText.init(modFormatText.create());
    }
}

export const model = new Model();