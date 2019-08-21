import * as React from "react";
import * as modFormatText from "format_text";
import * as model from "../model";

const fontSizes = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

function tranColorStringToNumber(colorStr: string) {
    colorStr = colorStr.split("(")[1].split(")")[0];
    let arr = colorStr.split(",");
    return (Number(arr[2]) << 16) | (Number(arr[1]) << 8) | Number(arr[0]);
}

export class Edit extends React.Component<{}, {}> {

    private _color: string = "#ffffff";
    private _size: number = fontSizes[6];
    private _lastTextHtml: string;
    private _refTextArea: React.RefObject<HTMLDivElement> = React.createRef();
    private _renderCount = 0;
    public constructor(props: Readonly<{}>) {
        super(props);

    }

    public render() {
        let renderCount = ++this._renderCount;
        let textElements = this._toTextElements(renderCount);
        let result = <div id="edit" style={{
            width: "100%",
            height: "100%",
        }}>
            <div 
                id="text_area" 
                key={`text_area_${renderCount}`}
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
                onFocus={this._onFocus.bind(this)}
                onBlur={this._onBlur.bind(this)}
                ref={this._refTextArea}
            >
                {
                    textElements
                }
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
                        value={this._size}
                    >
                        {
                            fontSizes.map((value) => {
                                return <option key={ value } value={ value }>{ value }</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>
    
        return result;
    }

    private _toTextElements(renderCount: number) {
        console.log("To text elements: ");
        let formatText = model.model.formatText;
        let data = formatText.data;
        let text = data.text;
        let formats = data.formats;
        let formatCount = formats.length;
        let brs = data.brs;
        let brCount = brs.length;
        let brStart = 0;
        
        let brElementCount = 0;

        let result: JSX.Element[] = [];
        result.length = formatCount;
        for (let i = 0; i < formatCount; ++i) {
            let format = formats[i];
            let subBegin = format.begin;
            let subEnd = format.end;
            let subResult: any[] = [];
            let style: React.CSSProperties = {};
            if (format.types & modFormatText.getFormatTypeBits(modFormatText.FormatType.COLOR)) {
                style.color = `#${format.color.toString(16)}`;
            }
            if (format.types & modFormatText.getFormatTypeBits(modFormatText.FormatType.SIZE)) {
                style.fontSize = `${format.size}px`;
            }
            if (format.types & modFormatText.getFormatTypeBits(modFormatText.FormatType.BOLD)) {
                style.fontWeight = `bold`;
            } else {
                style.fontWeight = `normal`;
            }
            if (format.types & modFormatText.getFormatTypeBits(modFormatText.FormatType.ITALIC)) {
                style.fontStyle = `italic`;
            } else {
                style.fontStyle = `normal`;
            }
            for (let j = brStart; j < brCount; ++j) {
                let index = brs[j];
                if (index < subEnd) {
                    if (subBegin !== index) {
                        let temp = text.substring(subBegin, index);
                        subResult.push(<span key={`r${renderCount}_span${subBegin}`}>{temp}</span>);
                        console.log(temp);
                    }
                    subResult.push(<br key={`r${renderCount}_br${j + 1}`}/>);
                    console.log("br");
                    ++brElementCount;
                    subBegin = index;
                    brStart = j + 1;
                } else {
                    brStart = j;
                    break;
                }
            }
            let temp = text.substring(subBegin, subEnd);
            subResult.push(<span key={`r${renderCount}_span${subBegin}`}>{temp}</span>);
            console.log(temp);
            
            result[i] = <span key={`r${renderCount}_stylespan${i + 1}`} style={style}>{subResult}</span>;
        }

        console.log(`Break element ${brElementCount}`);

        return result;
    }

    private _fromTextElements() {
        console.log("From text elements: ");
        let children = this._refTextArea.current.children;
        let formatText = model.model.formatText;
        let datas: modFormatText.Data[] = [];
        let len = children.length;
        for (let i = 0; i < len; ++i) {
            let element = children.item(i) as HTMLSpanElement;
            // if (! element.innerHTML) continue;
            let data: modFormatText.Data = modFormatText.create();
            let style = element.style;
            let childNodes = element.childNodes;
            let childNodeCount = childNodes.length;
            let text = "";
            for (let j = 0; j < childNodeCount; ++j) {
                let childNode = childNodes.item(j);
                if (childNode.nodeName === "BR") {
                    modFormatText.addBR(data, text.length);
                } else if (childNode.nodeName === "SPAN") {
                    let childNodes2 = childNode.childNodes;
                    let childNodes2Count = childNodes2.length;
                    for (let k = 0; k < childNodes2Count; ++k) {
                        let childNode2 = childNodes2[k];
                        if (childNode2.nodeName === "BR") {
                            modFormatText.addBR(data, text.length);
                        } else {
                            text += childNode2.nodeValue;
                        }
                    }
                } else {
                    text += childNode.nodeValue;
                }
            }
            data.text = text;
            let format: modFormatText.Format = { begin: 0, end: text.length, types: 0 };
            modFormatText.addFormatColor(format, tranColorStringToNumber(style.color));
            modFormatText.addFormatSize(format, Number(style.fontSize.slice(0, style.fontSize.length - 2)));
            if (style.fontWeight === "bold") {
                modFormatText.addFormats(format, modFormatText.FormatType.BOLD);
            }
            if (style.fontStyle === "italic") {
                modFormatText.addFormats(format, modFormatText.FormatType.ITALIC);
            }
            data.formats[0] = format;
            datas.push(data);
        }

        len = datas.length;
        if (len > 0) formatText.init(datas[0]);
        for (let i = 1; i < len; ++i) {
            formatText.append(datas[i]);
        }
        console.log(`Format text: ${formatText.toString()}`);
    }

    private _onFocus(event: FocusEvent) {
        let target = event.target;
        let innerHtml = (target as HTMLDivElement).innerHTML;
        this._lastTextHtml = innerHtml;
    }

    private _onBlur(event: FocusEvent) {
        let target = event.target;
        let innerHtml = (target as HTMLDivElement).innerHTML;
        if (this._lastTextHtml !== innerHtml) {
            this._fromTextElements();
            this.forceUpdate();
        }
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