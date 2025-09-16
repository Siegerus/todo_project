import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    root: 'src',
    base: '',
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
            reloadOnPartialChange: true,
            reload: true,
            refresh: true,
        }),
        {
            handleHotUpdate({ file, server }) {
                if (file.endsWith(".hbs")) {
                    server.ws.send({
                        type: "full-reload",
                        path: "*",
                    });
                }
            },
        },
    ],
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        /* rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                page1: resolve(__dirname, 'src/pages/page.html'),
                page2: resolve(__dirname, 'src/pages/page1.html'),
                page3: resolve(__dirname, 'src/pages/page2.html'),
            }
        } */
    },
});


/* import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { pageData } from './src/pages';

const partDirs = [
    'src/partials',
    'src/pages/about',
    'src/pages/node',
    'src/pages/oop',
];

export default defineConfig({
    root: 'src',
    base: '',
    plugins: [handlebars({
        context(pagePath) {
            return pageData[pagePath];
        },
        // partialDirectory: resolve(__dirname, 'src/partials'),
        partialDirectory: partDirs,
        reloadOnPartialChange: true,
    })],
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                about: resolve(__dirname, 'src/pages/about/index.html'),
                node: resolve(__dirname, 'src/pages/node/index.html'),
                oop: resolve(__dirname, 'src/pages/oop/index.html'),
                constructors: resolve(__dirname, 'src/pages/oop/constructors/index.html')
            }
        }
    },
}); */