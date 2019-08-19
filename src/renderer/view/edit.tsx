import * as React from "react";
import * as model from "../model";

const fontSizes = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

export class Edit extends React.Component<{}, {}> {

    private _color: string = "#ffffff";
    private _size: number = fontSizes[0];
    public constructor(props: Readonly<{}>) {
        super(props);

    }

    public render() {
        return (
            <div id="edit" style={{
                width: "100%",
                height: "100%",
            }}>
                <div 
                    id="text_area" 
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    style={{
                        display: "inline-block",
                        width: "90%",
                        height: "100%",
                        color: this._color,
                        fontSize: this._size,
                        verticalAlign: "top",
                    }}
                    onBlur={this._onBlur.bind(this)}
                >
                    <span>Please input text here.</span>
                </div>
                <div
                    id="tool_area"
                    style={{
                        display: "inline-block",
                        left: "90%",
                        width: "10%",
                        height: "100%",
                        verticalAlign: "top",
                    }}
                >
                    <div style={{
                    }}>
                        <span>Font color</span>
                        <input 
                            type="color" 
                            value={`${this._color}`} 
                            onChange={this._onColorChanged.bind(this)}
                            style={
                                {
                                    width: "100%",
                                    height: "50px",
                                    margin: "0px",
                                    border: "0px",
                                    padding: "0px",
                                }
                            }
                        ></input>
                    </div>
                    <div>
                        <span>Font size</span>
                        <select
                            style={{ 
                                width: "100%",
                                height: "50px",
                                margin: "0px",
                                border: "0px",
                                padding: "0px",
                                verticalAlign: "top",
                            }}
                            onChange={this._onSizeChanged.bind(this)}
                        >
                            {
                                fontSizes.map((value) => {
                                    return <option value={ value } selected={ value === this._size }>{ value }</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    private _onBlur(event: FocusEvent) {
        let target = event.target;
        let innerHtml = (target as HTMLDivElement).innerHTML;

    }

    private _onColorChanged(event: Event) {
        this._color = (event.target as HTMLInputElement).value;
        this.forceUpdate();
    }

    private _onSizeChanged(event: Event) {
        this._size = Number((event.target as HTMLSelectElement).value);
        this.forceUpdate();
    }
}