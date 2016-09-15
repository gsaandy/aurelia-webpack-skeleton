const path = require('path');
const generateConfig = require('@easy-webpack/core').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'dev';

const SRC_ROOT_DIR = path.resolve('src/main');
const TS_ROOT_DIR = SRC_ROOT_DIR + '/app';
const TARGET_DIR = path.resolve('target');
const ROOT_DIR = path.resolve();
const BASE_URL = "/";
const packageJson = require('./package.json');

const isProductionEnv = ENV === 'production';

let resultConfig;

const CORE_BUNDLES = {
    bootstrap: [
        'aurelia-bootstrapper-webpack',
        'aurelia-polyfills',
        'aurelia-pal',
        'aurelia-pal-browser',
        'regenerator-runtime',
        'bluebird'
    ],
    // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
    aurelia: [
        'aurelia-bootstrapper-webpack',
        'aurelia-binding',
        'aurelia-dependency-injection',
        'aurelia-event-aggregator',
        'aurelia-framework',
        'aurelia-history',
        'aurelia-history-browser',
        'aurelia-loader',
        'aurelia-loader-webpack',
        'aurelia-logging',
        'aurelia-logging-console',
        'aurelia-metadata',
        'aurelia-pal',
        'aurelia-pal-browser',
        'aurelia-path',
        'aurelia-polyfills',
        'aurelia-route-recognizer',
        'aurelia-router',
        'aurelia-task-queue',
        'aurelia-templating',
        'aurelia-templating-binding',
        'aurelia-templating-router',
        'aurelia-templating-resources'
    ]
};

const baseConfig = {
    metadata: {
        title: "Todos",
        configFile: 'config/app-config.js'
    },
    entry: {
        'app': [/* this is filled by the aurelia-webpack-plugin */],
        'js/aurelia-bootstrap': CORE_BUNDLES.bootstrap,
        'js/aurelia': CORE_BUNDLES.aurelia.filter(pkg => CORE_BUNDLES.bootstrap.indexOf(pkg) === -1)
    },
    resolve: {
        modules: [SRC_ROOT_DIR, path.resolve("node_modules")],
        extensions: ['', '.js', '.ts']
    },
    output: {
        path: path.join(TARGET_DIR, packageJson.name),
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: path.join(SRC_ROOT_DIR, 'config'), to: 'config' }
        ])
    ]
};

const commonConfig = generateConfig(
    baseConfig,
    require('@easy-webpack/config-aurelia')({
        root: ROOT_DIR,
        src: SRC_ROOT_DIR,
        baseUrl: BASE_URL
    }),

    require('@easy-webpack/config-typescript')(),
    require('@easy-webpack/config-html')({
        exclude: path.join(SRC_ROOT_DIR, 'index.html')
    }),

    require('@easy-webpack/config-sass')({
        filename: 'css/styles.css',
        allChunks: true,
        sourceMap: false,
    }),

    require('@easy-webpack/config-fonts-and-images')(),
    require('@easy-webpack/config-global-bluebird')(),
    require('@easy-webpack/config-global-jquery')(),
    require('@easy-webpack/config-global-regenerator')(),
    require('@easy-webpack/config-generate-index-html')({
        minify: isProductionEnv,
        overrideOptions: {
            template: path.join(SRC_ROOT_DIR, 'index.html')
        }
    }),

    require('@easy-webpack/config-copy-files')({
        patterns: [
            { from: 'favicon.ico', to: 'favicon.ico' },
            { from: path.join(SRC_ROOT_DIR, 'config'), to: 'config' },
            { from: path.join(SRC_ROOT_DIR, 'assets'), to: 'assets' },
        ]
    }),

    require('@easy-webpack/config-common-chunks-simple')({
        appChunkName: 'app', firstChunk: 'js/aurelia-bootstrap'
    })
);

switch (ENV) {
    case 'production':
        resultConfig = generateConfig(
            commonConfig,
            require('@easy-webpack/config-env-production')({compress: true}),
            require('@easy-webpack/config-uglify')({debug: false})
        );
        break;
    case 'dev':
        process.env.NODE_ENV = 'development';
        resultConfig = generateConfig(
            commonConfig,
            require('@easy-webpack/config-env-development')()
        );
        break;
    default:
        throw new Error("Unsupported environment..supported ['prod','dev']")
}

module.exports = resultConfig;
