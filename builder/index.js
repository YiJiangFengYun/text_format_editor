var fsExtra = require("fs-extra");
var path = require("path");
var fs = require("fs");
var os = require("os");
var childProcess = require("child_process");
var commandLineArgs = require("command-line-args");

const BUILD_PATH = path.join(process.cwd(), "build");

// option definitions.
const optionDefinitions = [
    { name: "production", alias: "p", type: Boolean },
]

// parse option from command line args.
const options = commandLineArgs(optionDefinitions);

Promise.resolve()
.then(() => {
    return fsExtra.remove(BUILD_PATH);
})
.then(() => {
    return build();
})
.then(() => {
    return createContextConfig();
})
.then(() => {
    console.info("Succeeded to build.");
    process.exit(0);
})
.catch((err) => {
    console.error(`Failed to build.`);
    console.error(err);
    process.exit(1);
});

function build() {
    let npmCmd = os.platform() === "win32" ? "npm.cmd" : "npm"
    if (options.production) {
        return execProcess(npmCmd, ["run", "_build_production"]);
    } else {
        return execProcess(npmCmd, ["run", "_build_development"]);
    }
}

function createContextConfig() {
    return new Promise((resolve, reject) => {
        //create config js.
        let contextConfig = {
            debug: options.production ? false : true,
            logLevel: options.production ? "info" : "debug",
        };
    
        let contextJsonPath = path.join(BUILD_PATH, "context.json");
        fs.writeFile(
            contextJsonPath,
            JSON.stringify(contextConfig),
            { flag: "w+" },
            function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            }
        );
    });   
}

function execProcess(command, args) {
    return new Promise((resolve, reject) => {
        let childProc = childProcess.spawn(
            command, 
            args,
            {
                stdio: "inherit", 
                windowsHide: true,
            }
        );
        childProc.once("exit", (code) => {
            if (code) {
                reject(`Failed to execute command ${command}.`);
            } else {
                resolve();
            }
        });
        childProc.on("error", (err) => {
            console.error(err);
        });
    })
    
}
