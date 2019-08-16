const path = require('path')
const prodRendererConfig = {
    entry: "./src/renderer/index.tsx",
    output: {
        filename: "index.pack.js",
        path: path.join(__dirname, "build/renderer")
    },
    target: "electron-renderer",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled.
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.renderer.production.json",
                }
                // exclude: /node_modules/,
            },
        ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
    mode: 'production',
};

const prodWebWorkerConfig = {
    entry: "./src/web_worker/index.ts",
    output: {
        filename: "index.pack.js",
        path: path.join(__dirname, "build/web_worker")
    },
    target: "webworker",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled.
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.renderer.production.json",
                }
                // exclude: /node_modules/,
            },
        ]
    },
    mode: 'production',
};

module.exports = [
    prodRendererConfig, prodWebWorkerConfig,
];