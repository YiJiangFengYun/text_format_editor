import * as React from "react";
import * as log from 'loglevel';
import * as modFormatText from "format_text";
import * as model from "../model";
import * as common from "../common";

const fontSizes = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
const defaultSize = fontSizes[6];
const defaultColor = 0xffffff;

function tranColorStringToNumber(colorStr: string) {
    if (colorStr[0] === "#") {
        return Number(`0x${colorStr.slice(1)}`);
    } else if (colorStr.slice(0, 3) === "rgb") {
        colorStr = colorStr.split("(")[1].split(")")[0];
        let arr = colorStr.split(",");
        return (Number(arr[0]) << 16) | (Number(arr[1]) << 8) | Number(arr[2]);
    } else {
        log.error(`Unkown color string: ${colorStr}`);
        return 0;
    }
}

function tranColorNumberToString(colorNum: number) {
    let red = (colorNum >> 16) & 0xff;
    let green = (colorNum >> 8) & 0xff;
    let blue = colorNum & 0xff;
    let redStr = red.toString(16);
    if (redStr.length < 2) redStr = "0" + redStr;
    let greenStr = green.toString(16);
    if (greenStr.length < 2) greenStr = "0" + greenStr;
    let blueStr = blue.toString(16);
    if (blueStr.length < 2) blueStr = "0" + blueStr;
    return `#${redStr}${greenStr}${blueStr}`;
}

export class Edit extends React.Component<{}, { 
    color: string, 
    size: number, 
    bold: boolean, 
    italic: boolean,
    backgroundColor: string,
}> {

    private _lastTextHtml: string;
    private _refTextArea: React.RefObject<HTMLDivElement> = React.createRef();
    private _textVersion = 0;
    public constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            color: tranColorNumberToString(defaultColor),
            size: defaultSize,
            bold: false,
            italic: false,
            backgroundColor: "#000000",
        };
        this._upTextVersion();
    }

    public render() {
        let state = this.state;
        let textElements = this._toTextElements(this._textVersion);
        let result = <div id="edit" style={{
            width: "100%",
            height: "100%",
            boxSizing: "content-box",
        }}>
            <div 
                id="text_area" 
                key={`text_area_${this._textVersion}`}
                contentEditable={true}
                suppressContentEditableWarning={true}
                style={{
                    display: "inline-block",
                    width: "90%",
                    height: "100%",
                    verticalAlign: "top",
                    boxSizing: "border-box",
                    // position: "absolute",
                    backgroundColor: state.backgroundColor,
                    color: state.color,
                    fontSize: state.size,
                    fontWeight: state.bold ? "bold" : "normal",
                    fontStyle: state.italic ? "italic" : "normal",
                }}
                onFocus={this._onFocus.bind(this)}
                onBlur={this._onBlur.bind(this)}
                onMouseUp={this._onMouseUp.bind(this)}
                ref={this._refTextArea}
            >
                {
                    textElements
                }
            </div>
            <div id="right_area"
                 style={
                     {
                        display: "inline-block",
                        left: "90%",
                        width: "10%",
                        height: "100%",
                        verticalAlign: "top",
                        boxSizing: "border-box",
                        position: "absolute",
                     }
                 }>
                <div
                    id="tool_area"
                    style={{
                        position: "absolute",
                        top: "0px",
                    }}
                >
                    <div className="tool" style={{
                    }}>
                        <span className="tool title">Background color</span>
                        <input 
                            className="tool item button"
                            type="color" 
                            value={`${state.backgroundColor}`} 
                            onChange={this._onBackgroundColorChanged.bind(this)}
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
                    <div className="tool" style={{
                    }}>
                        <span className="tool title">Color</span>
                        <input
                            className="tool item button"
                            type="color" 
                            value={`${state.color}`} 
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
                    <div className="tool">
                        <span className="tool title">Size</span>
                        <select
                            className="tool item button"
                            style={{ 
                                width: "100%",
                                height: "50px",
                                margin: "0px",
                                border: "0px",
                                padding: "0px",
                                verticalAlign: "top",
                            }}
                            onChange={this._onSizeChanged.bind(this)}
                            value={state.size}
                        >
                            {
                                fontSizes.map((value) => {
                                    return <option key={ value } value={ value }>{ value }</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="tool">
                        <div className="tool title">Bold</div>
                        <img
                            className="tool item button" 
                            src="image/bold.png"
                            style = {
                                {
                                    backgroundColor: state.bold ? "gray" : "transparent",
                                    margin: "0px",
                                    border: "0px",
                                    padding: "0px",
                                    width: "100%",
                                    height: "auto",
                                }
                            }
                            onClick={this._onClickBold.bind(this)}
                        >
                        </img>
                    </div>
                    <div className="tool">
                        <div className="tool title">Italic</div>
                        <img
                            className="tool item button"
                            src="image/italic.png"
                            style = {
                                {
                                    backgroundColor: state.italic ? "gray" : "transparent",
                                    margin: "0px",
                                    border: "0px",
                                    padding: "0px",
                                    width: "100%",
                                    height: "auto",
                                }
                            }
                            onClick={this._onClickItalic.bind(this)}
                        >
                        </img>
                    </div>
                </div>
                <div id="export_import"
                    style={{
                        position: "absolute",
                        bottom: "0px",
                        textAlign: "center",
                        width: "100%",
                        height: "50px",
                    }}>
                    <button id="export" className="button" onClick={this._onExport.bind(this)}>Export</button>
                    <button id="import" className="button" onClick={this._onImport.bind(this)}>Import</button>
                </div>
            </div>
            
        </div>
    
        return result;
    }

    private _toTextElements(textVersion: number) {
        let formatText = model.model.formatText;
        let data = formatText.data;
        let text = data.text;
        let formats = data.formats;
        let formatCount = formats.length;
        let brs = data.brs;
        let brCount = brs.length;
        let brStart = 0;
        
        let result: JSX.Element[] = [];
        result.length = formatCount;
        for (let i = 0; i < formatCount; ++i) {
            let format = formats[i];
            let subBegin = format.begin;
            let subEnd = format.end;
            let subResult: any[] = [];
            let style: React.CSSProperties = {};
            if (format.types & modFormatText.getFormatTypeBits(modFormatText.FormatType.COLOR)) {
                let colorStr = tranColorNumberToString(format.color);
                style.color = colorStr;
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
                        subResult.push(<span className="text_span" key={`r${textVersion}_span${subBegin}`}>{temp}</span>);
                    }
                    subResult.push(<br key={`r${textVersion}_br${j + 1}`}/>);
                    subBegin = index;
                    brStart = j + 1;
                } else {
                    brStart = j;
                    break;
                }
            }
            let temp = text.substring(subBegin, subEnd);
            subResult.push(<span className="text_span" key={`r${textVersion}_span${subBegin}`}>{temp}</span>);
            
            result[i] = <span className="text_style_span" key={`r${textVersion}_stylespan${i + 1}`} style={style}>{subResult}</span>;
        }

        return result;
    }

    private _fromTextElements() {
        let childNodesOfTextArea = this._refTextArea.current.childNodes;
        let formatText = model.model.formatText;
        let datas: modFormatText.Data[] = [];
        let len = childNodesOfTextArea.length;
        for (let i = 0; i < len; ++i) {
            let node = childNodesOfTextArea.item(i);
            if (node.nodeName === "BR") {
                //When all words of the text is deleted, all style spans will be replaced with a br.
                continue;
            } else if (node.nodeName === "#text") {
                //When all words of the text is deleted then input words, words will be as pure text.
                if (typeof node.nodeValue !== "string") {
                    throw new Error("The nodeValue of node is not a string.");
                }
                let data: modFormatText.Data = modFormatText.create(
                    node.nodeValue, 
                    this.state.size,
                    tranColorStringToNumber(this.state.color),
                );
                datas.push(data);
            } else {
                let data: modFormatText.Data = modFormatText.create();
                let element = node as HTMLSpanElement;
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
                if (typeof text !== "string") {
                    throw new Error("The final text is not a string.");
                }
                data.text = text;
                let format: modFormatText.Format = { begin: 0, end: text.length, types: 0 };
                //Style color may be undefined When all words of the text is deleted then directly input any words, words will be as pure text.
                modFormatText.addFormatColor(format, tranColorStringToNumber(style.color || this.state.color));
                modFormatText.addFormatSize(format, Number(style.fontSize.slice(0, style.fontSize.length - 2)));
                if (style.fontWeight === "bold") {
                    modFormatText.addFormats(format, modFormatText.getFormatTypeBits(modFormatText.FormatType.BOLD));
                }
                if (style.fontStyle === "italic") {
                    modFormatText.addFormats(format, modFormatText.getFormatTypeBits(modFormatText.FormatType.ITALIC));
                }
                data.formats[0] = format;
                datas.push(data);
            }
        }

        len = datas.length;
        if (len > 0) {
            formatText.init(datas[0]);
        } else {
            formatText.init();
        }

        for (let i = 1; i < len; ++i) {
            formatText.append(datas[i]);
        }
        this._upTextVersion();
    }

    private _applyColor(color: number) {
        let selectedRange = this._getSelectedRange();
        if ( ! selectedRange) return;
        let begin = selectedRange[0];
        let end = selectedRange[1];
        model.model.formatText.setColor(begin, end, color);
        this._upTextVersion();
    }

    private _applySize(size: number) {
        let selectedRange = this._getSelectedRange();
        if ( ! selectedRange) return;
        let begin = selectedRange[0];
        let end = selectedRange[1];
        model.model.formatText.setSize(begin, end, size);
        this._upTextVersion();
    }

    private _applyBold(bold: boolean) {
        let selectedRange = this._getSelectedRange();
        if ( ! selectedRange) return;
        let begin = selectedRange[0];
        let end = selectedRange[1];
        if (bold) {
            model.model.formatText.setBold(begin, end);
        } else {
            model.model.formatText.unsetBold(begin, end);
        }
        this._upTextVersion();
    }

    private _applyItalic(italic: boolean) {
        let selectedRange = this._getSelectedRange();
        if ( ! selectedRange) return;
        let begin = selectedRange[0];
        let end = selectedRange[1];
        if (italic) {
            model.model.formatText.setItalic(begin, end);
        } else {
            model.model.formatText.unsetItalic(begin, end);
        }
        this._upTextVersion();
    }

    private _upTextVersion() {
        ++this._textVersion;
    }

    private _getSelectedRange() {
        let selection = window.getSelection();
        let anchorNode = selection.anchorNode;
        let anchorOffset = selection.anchorOffset;
        let focusNode = selection.focusNode;
        let focusOffset = selection.focusOffset;
        if (! anchorNode || anchorNode.nodeName !== "#text") {
            log.warn("Anchor Node of the selection is not a text node.");
            return null;
        }
        if (! focusNode || focusNode.nodeName !== "#text") {
            log.warn("Focus Node of the selection is not a text node.");
            return null;
        }
        function chilrenIndexOf(children: NodeListOf<ChildNode>, node: Node) {
            let len = children.length;
            for (let i = 0; i < len; ++i) {
                if (children.item(i) === node) return i;
            }
            return -1;
        }
        let begin: number;
        let end: number;
        {
            let textAreaNode = this._refTextArea.current;
            let spanAnchor = anchorNode.parentNode as HTMLSpanElement;
            if (! spanAnchor.classList.contains("text_span")) {
                log.warn("Selection anchor is not in a text span.");
                return null;
            }
            let spanFocus = focusNode.parentNode as HTMLSpanElement;
            if (! spanFocus.classList.contains("text_span")) {
                log.warn("Selection focus is not in a text span.");
                return null;
            }
            let styleSpanAnchor = spanAnchor.parentNode as HTMLSpanElement;
            if (! styleSpanAnchor.classList.contains("text_style_span")) {
                log.warn("Selection anchor is not in a text style span.");
                return null;
            }
            let styleSpanFocus = spanFocus.parentNode as HTMLSpanElement;
            if (! styleSpanFocus.classList.contains("text_style_span")) {
                log.warn("Selection focus is not in a text style span.");
                return null;
            }
            let indexAnchor = chilrenIndexOf(styleSpanAnchor.childNodes, spanAnchor);
            if (indexAnchor < 0) {
                throw new Error("The span element is not a child of the style span element.");
            }
            let indexFocus = chilrenIndexOf(styleSpanFocus.childNodes, spanFocus);
            if (indexFocus < 0) {
                throw new Error("The span element is not a child of the style span element.");
            }
            
            let indexStyleSpanAnchor = chilrenIndexOf(textAreaNode.childNodes, styleSpanAnchor);
            if (indexStyleSpanAnchor < 0) {
                throw new Error("The style span element is not a child of the text area.");
            }
            let indexStyleSpanFocus = chilrenIndexOf(textAreaNode.childNodes, styleSpanFocus);
            if (indexStyleSpanFocus < 0) {
                throw new Error("The style span element is not a child of the text area.");
            }
            let spanBegin: HTMLSpanElement;
            let styleSpanBegin: HTMLSpanElement;
            let spanEnd: HTMLSpanElement;
            let styleSpanEnd: HTMLSpanElement;
            let indexBegin: number;
            let indexEnd: number;
            let indexStyleBegin: number;
            let indexStyleEnd: number;
            let offsetBegin: number;
            let offsetEnd: number;
            if (indexStyleSpanAnchor <= indexStyleSpanFocus) {
                styleSpanBegin = styleSpanAnchor;
                styleSpanEnd = styleSpanFocus;
                indexStyleBegin = indexStyleSpanAnchor;
                indexStyleEnd = indexStyleSpanFocus;
               
                if (indexStyleSpanAnchor == indexStyleSpanFocus) {
                    if (indexAnchor <= indexFocus) {
                        spanBegin = spanAnchor;
                        spanEnd = spanFocus;
                        indexBegin = indexAnchor;
                        indexEnd = indexFocus;
                        if (indexAnchor == indexFocus) {
                            if (anchorOffset <= focusOffset) {
                                offsetBegin = anchorOffset;
                                offsetEnd = focusOffset;
                            } else {
                                offsetBegin = focusOffset;
                                offsetEnd = anchorOffset;
                            }
                        } else {
                           offsetBegin = anchorOffset;
                           offsetEnd = focusOffset;
                        }
                    } else {
                        spanBegin = spanFocus;
                        spanEnd = spanAnchor;
                        offsetBegin = focusOffset;
                        offsetEnd = anchorOffset;
                        indexBegin = indexFocus;
                        indexEnd = indexAnchor;
                    }
                } else {
                    spanBegin = spanAnchor;
                    spanEnd = spanFocus;
                    offsetBegin = anchorOffset;
                    offsetEnd = focusOffset;
                    indexBegin = indexAnchor;
                    indexEnd = indexFocus;
                }
            } else {
                spanBegin = spanFocus;
                styleSpanBegin = styleSpanFocus;
                spanEnd = spanAnchor;
                styleSpanEnd = styleSpanAnchor;
                indexStyleBegin = indexStyleSpanFocus;
                indexStyleEnd = indexStyleSpanAnchor;
                offsetBegin = focusOffset;
                offsetEnd = anchorOffset;
                indexBegin = indexFocus;
                indexEnd = indexAnchor;
            }

            let preStr = "";
            let postStr = "";

            //Prefix String
            {
                let beginStr = "";
                let endStr = "";

                //Begin string
                {
                    let childrenStyle = textAreaNode.childNodes;
                    for (let i = 0; i < indexStyleBegin; ++i) {
                        let childStyle = childrenStyle.item(i);
                        let chilren = childStyle.childNodes;
                        let childCount = chilren.length;
                        for (let j = 0; j < childCount; ++j) {
                            let child = chilren.item(j);
                            if (child.nodeName == "SPAN") {
                                beginStr += (child as HTMLSpanElement).innerText;
                            }
                        }
                    }
                }
    
                //End string
                {
                    
                    let children = styleSpanBegin.childNodes;
                    let index = indexBegin;
                    for (let i = 0; i < index; ++i) {
                        let child = children.item(i);
                        if (child.nodeName == "SPAN") {
                            endStr += (child as HTMLSpanElement).innerText;
                        }
                    }

                    endStr += spanBegin.innerText.slice(0, offsetBegin);
                }

                preStr = beginStr + endStr;
            }

            //Post string
            {

                let beginStr = "";
                let endStr = "";

                //Begin string
                {
                    beginStr += spanEnd.innerText.slice(offsetEnd);

                    let children = styleSpanEnd.childNodes;
                    let childCount = children.length;
                    let index = indexEnd;
                    for (let i = index + 1; i < childCount; ++i) {
                        let child = children.item(i);
                        if (child.nodeName == "SPAN") {
                            beginStr += (child as HTMLSpanElement).innerText;
                        }
                    }
    
                }

                //End string.
                {
                    let childrenStyle = textAreaNode.childNodes;
                    let childStyleCount = childrenStyle.length;
                    for (let i = indexStyleEnd + 1; i < childStyleCount; ++i) {
                        let childStyle = childrenStyle.item(i);
                        let chilren = childStyle.childNodes;
                        let childCount = chilren.length;
                        for (let j = 0; j < childCount; ++j) {
                            let child = chilren.item(j);
                            if (child.nodeName == "SPAN") {
                                endStr += (child as HTMLSpanElement).innerText;
                            }
                        }
                    }
                }

                postStr = beginStr + endStr;
            }

             begin = preStr.length;
             end = model.model.formatText.data.text.length - postStr.length;
        }

        return [begin, end];
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

    private _onMouseUp() {
        let selectedRange = this._getSelectedRange();
        if (! selectedRange) return;
        let formats = model.model.formatText.getFormats(selectedRange[0], selectedRange[1]);
        let color: number;
        let size: number;
        let bold: boolean;
        let italic: boolean;
        if (! formats || formats.length !== 1) {
            color = defaultColor;
            size = defaultSize
        } else {
            if (formats[0].types & modFormatText.getFormatTypeBits(modFormatText.FormatType.COLOR)) {
                color = formats[0].color;
            } else {
                color = defaultColor;
            }
            if (formats[0].types & modFormatText.getFormatTypeBits(modFormatText.FormatType.SIZE)) {
                size = formats[0].size;
            } else {
                size = defaultSize;
            }
            if (formats[0].types & modFormatText.getFormatTypeBits(modFormatText.FormatType.BOLD)) {
                bold = true;
            } else {
                bold = false;
            }
            if (formats[0].types & modFormatText.getFormatTypeBits(modFormatText.FormatType.ITALIC)) {
                italic = true;
            } else {
                italic = false;
            }
            
        }
        this.setState({ 
            color: tranColorNumberToString(color), 
            size: size,
            bold: bold,
            italic: italic,
        });
    }

    private _onBackgroundColorChanged(event: Event) {
        let color = (event.target as HTMLInputElement).value;
        this.setState({ backgroundColor: color });
    }

    private _onColorChanged(event: Event) {
        let color = (event.target as HTMLInputElement).value;
        this._applyColor(tranColorStringToNumber(color));
        this.setState({ color: color });
        this.forceUpdate();
    }

    private _onSizeChanged(event: Event) {
        let size = Number((event.target as HTMLSelectElement).value);
        this._applySize(size);
        this.setState({ size: size });
        this.forceUpdate();
    }

    private _onClickBold() {
        let bold = ! this.state.bold;
        this._applyBold(bold)
        this.setState({ bold: bold });
        this.forceUpdate();
    }

    private _onClickItalic() {
        let italic = ! this.state.italic;
        this._applyItalic(italic);
        this.setState({ italic: italic });
        this.forceUpdate();
    }

    private _onExport() {
        common.dataExport.export();
    }

    private _onImport() {
        let context = this;
        common.dataImport.import()
        .then((res) => {
            if (res) {
                context.forceUpdate();
            }
        });
    }
}