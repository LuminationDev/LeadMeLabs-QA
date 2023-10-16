const path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')
const { defineConfig } = require('vite');

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: path.join(__dirname, 'src', 'renderer'),
    publicDir: 'public',
    server: {
        port: 55565,
    },
    open: false,
    build: {
        outDir: path.join(__dirname, 'build', 'renderer'),
        emptyOutDir: true,
    },
    plugins: [vuePlugin()],
    pluginOptions: {
        electronBuilder: {
            preload: 'src/main/preload.js',
        }
    },
    resolve: {
        alias: {
            path: 'path-browserify',
            '@renderer': path.resolve(__dirname, 'src/renderer/src')
        }
    },
});

module.exports = config;
