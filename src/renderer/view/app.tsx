import * as React from "react";
import * as log from 'loglevel';
import { Edit } from "./edit";

export class App extends React.Component<{}, {}> {

    public resizeHandler: (this: Window, ev: UIEvent) => any;

    public constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
        };

        this.resizeHandler = this._onResize.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("resize", this.resizeHandler);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.resizeHandler);

    }

    public render() {
        return (
            <div id="app" style={{
                width: "100%",
                height: "100%",
            }}>
                <Edit />
            </div>
        );
    }

    private _onResize(ev: UIEvent) {
        log.debug(`The editor window is resized.`);
        this.forceUpdate();
    }
}