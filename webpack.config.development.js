const path = require('path')

const devRendererConfig = {
    entry: "./src/renderer/index.tsx",
    output: {
        filename: "index.pack.js",
        path: path.join(__dirname, "build/renderer")
    },
    target: "electron-renderer",
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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
                    configFile: "tsconfig.renderer.development.json",
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
    mode: 'development',
};

const devWebWorkerConfig = {
    entry: "./src/web_worker/index.ts",
    output: {
        filename: "index.pack.js",
        path: path.join(__dirname, "build/web_worker")
    },
    target: "webworker",
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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
                    configFile: "tsconfig.renderer.development.json",
                }
                // exclude: /node_modules/,
            },
        ]
    },
    mode: 'development',
};

module.exports = [
    devRendererConfig, devWebWorkerConfig,
];