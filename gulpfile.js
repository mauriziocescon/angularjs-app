/*--------------------------*/
/* Build scripts            */
/*--------------------------*/

const babelify = require("babelify");
const browserify = require("browserify");
const browserSync = require("browser-sync").create();
const del = require("del");
const fs = require("fs");
const glob = require("glob");
const gulp = require("gulp");
const gulpAngularTemplateCache = require("gulp-angular-templatecache");
const gulpBootlint = require("gulp-bootlint");
const gulpCleanCSS = require("gulp-clean-css");
const gulpFlatten = require("gulp-flatten");
const gulpInject = require("gulp-inject");
const gulpNgAnnotate = require("gulp-ng-annotate");
const gulpPreprocess = require("gulp-preprocess");
const gulpRename = require("gulp-rename");
const gulpSass = require("gulp-sass");
const gulpSourcemaps = require("gulp-sourcemaps");
const gulpStylelint = require("gulp-stylelint");
const gulpTslint = require("gulp-tslint");
const gulpUglify = require("gulp-uglify");
const gulpUtil = require("gulp-util");
const karmaServer = require("karma").Server;
const path = require("path");
const runSequence = require("run-sequence");
const tsify = require("tsify");
const vinylBuffer = require("vinyl-buffer");
const vinylSourceStream = require("vinyl-source-stream");
const watchify = require("watchify");
const yargs = require("yargs");

const package = JSON.parse(fs.readFileSync("./package.json"));
const version = package.version;
const mock = yargs.argv.mock;
const prod = yargs.argv.prod;

const paths = {
    baseFiles: [
        "src/index.html",
        "src/manifest.json",
        "src/serviceworker.js"
    ],
    uibTemplates: ["src/app/shared/uib-custom/**/*.html"],
    htmlTemplates: [
        "src/app*/**/*.html",
        "!src/app*/shared/uib-custom/**/"
    ],
    sass: ["src/styles.scss"],
    imgs: ["src/assets*/imgs/**/"],
    fonts: [
        "src/assets/fonts/**/",
        "node_modules/font-awesome/fonts/**/",
        "node_modules/roboto-fontface/fonts/**/"
    ],
    i18n: [
        "src/assets/i18n/**/*.json",
    ],
    htmlTemplatesLint: [
        "src/index.html",
        "src/app*/**/*.html",
        "!src/app*/shared/uib-custom/**/"
    ],
    sassLint: ["src/**/*.scss"],
    tsLint: [
        "dist/tmp_ts/**/",
        "e2e-tests/**/*.ts"
    ],
    preprocessTs: ["src/**/*.ts"],
    browserifyEntries: ["dist/tmp_ts/main.ts"],
    dependencies: [
        "jquery",
        "angular",
        "angular-animate",
        "angular-dynamic-locale",
        "angular-loading-bar",
        "angular-mocks",
        "angular-sanitize",
        "angular-stats",
        "angular-touch",
        "angular-translate",
        "angular-translate-loader-static-files",
        "angular-translate-storage-local",
        "angular-ui-bootstrap",
        "angular-ui-router",
        "angular-ui-scroll",
        "babel-polyfill",
        "bootstrap-sass",
        "ng-infinite-scroll",
        "stacktrace-js"
    ],
    locales: [
        "node_modules/angular-i18n/angular-locale_de.js",
        "node_modules/angular-i18n/angular-locale_en.js",
        "node_modules/angular-i18n/angular-locale_en-gb.js",
        "node_modules/angular-i18n/angular-locale_en-us.js",
        "node_modules/angular-i18n/angular-locale_it.js"
    ]
};


/*--------------------------*/
/* Utilities                */
/*--------------------------*/

const hash = new Date().getTime() + "-" + version;

function appendHashToFileName(fileName) {
    return fileName.substring(0, fileName.lastIndexOf(".")) + "-" + hash + fileName.substring(fileName.lastIndexOf("."));
}

const watchedBrowserify = watchify(browserify({
    basedir: ".",
    cache: {},
    debug: true,
    entries: paths.browserifyEntries,
    packageCache: {}
})
    .external(paths.dependencies))
    .plugin(tsify)
    .on("log", gulpUtil.log);


/*--------------------------*/
/* Common tasks             */
/*--------------------------*/

gulp.task("empty-dist", () => {
    return del.sync(["dist/**/*"]);
});

gulp.task("bootlint", () => {
    return gulp.src(paths.htmlTemplatesLint)
        .pipe(gulpBootlint({
            disabledIds: ["E001", "W001", "W002", "W003", "W005"],
            loglevel: "debug"
        }));
});

gulp.task("sass-lint", () => {
    return gulp.src(paths.sassLint)
        .pipe(gulpStylelint({
            reporters: [
                {formatter: "verbose", console: true}
            ],
            failAfterError: true
        }));
});

gulp.task("copy-base-files", () => {
    return gulp.src(paths.baseFiles)
        .pipe(gulpPreprocess({
            context: {"HASH": hash}
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-locales", () => {
    return gulp.src(paths.locales)
        .pipe(gulp.dest("dist/locales/"));
});

gulp.task("cache-uib-templates", () => {
    return gulp.src(paths.uibTemplates)
        .pipe(gulpRename((path) => {
            const arr = path.dirname.split("/");
            path.dirname = arr[arr.length - 1] || arr[arr.length - 2];
        }))
        .pipe(gulpAngularTemplateCache(appendHashToFileName("uibtemplates.js"), {
            root: "uib/template",
            module: "ui.bootstrap.tpls",
            standalone: false
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("cache-html-templates", () => {
    return gulp.src(paths.htmlTemplates)
        .pipe(gulpRename({dirname: ""}))
        .pipe(gulpAngularTemplateCache(appendHashToFileName("templates.js"), {
            root: "",
            module: "app-templates",
            standalone: true
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-imgs", () => {
    return gulp.src(paths.imgs)
        .pipe(gulpFlatten())
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-fonts", () => {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-i18n", () => {
    return gulp.src(paths.i18n)
        .pipe(gulp.dest("dist/i18n/"));
});

gulp.task("sass-dev", () => {
    return gulp.src(paths.sass)
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpRename(appendHashToFileName("app.css")))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            if (sourcePath.startsWith("node_modules")) {
                return sourcePath;
            }
            return "../src/" + sourcePath;
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("sass-prod", () => {
    return gulp.src(paths.sass)
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpCleanCSS({debug: true}, (details) => {
            console.log(details.name + ": " + details.stats.originalSize);
            console.log(details.name + ": " + details.stats.minifiedSize);
        }))
        .pipe(gulpRename(appendHashToFileName("app.css")))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            if (sourcePath.startsWith("node_modules")) {
                return sourcePath;
            }
            return "../src/" + sourcePath;
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("bundle-vendors", () => {
    return browserify({
        debug: true
    })
        .require(paths.dependencies)
        .bundle()
        .pipe(vinylSourceStream(appendHashToFileName("vendors.js")))
        .pipe(vinylBuffer())
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            if (sourcePath.startsWith("node_modules")) {
                return "../" + sourcePath;
            }
            return "../src/" + sourcePath;
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("preprocess-ts", () => {
    return gulp.src(paths.preprocessTs)
        .pipe(gulpPreprocess({
            includeExtensions: [".tsx", ".ts"],
            context: {"MOCK_BACKEND": mock, "PROD": prod}
        }))
        .pipe(gulp.dest("dist/tmp_ts/"));
});

gulp.task("tslint", () => {
    return gulp.src(paths.tsLint)
        .pipe(gulpTslint({
            formatter: "stylish"
        }))
        .pipe(gulpTslint.report({
            emitError: true,
            summarizeFailureOutput: true
        }));
});

gulp.task("compile-ts-dev", () => {
    return watchedBrowserify
        .transform(babelify, {presets: ["env"], extensions: [".tsx", ".ts"]})
        .bundle()
        .on("error", (e) => {
            gulpUtil.log(gulpUtil.colors.red("Bundle error:", e.message));
        })
        .pipe(vinylSourceStream(appendHashToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            // change dist/tmp_ts to src
            return "../src/" + sourcePath.substring(12);
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("compile-ts-spec", () => {
    return browserify({
        basedir: ".",
        cache: {},
        debug: true,
        entries: paths.browserifyEntries.concat(glob.sync("dist/tmp_ts/**/*.spec.ts")),
        packageCache: {}
    })
        .external(paths.dependencies)
        .plugin(tsify)
        .transform(babelify, {presets: ["env"], extensions: [".tsx", ".ts"]})
        .bundle()
        .pipe(vinylSourceStream(appendHashToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            // change dist/tmp_ts to src
            return "../src/" + sourcePath.substring(12);
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("compile-ts-prod", () => {
    return browserify({
        basedir: ".",
        cache: {},
        debug: true,
        entries: paths.browserifyEntries,
        packageCache: {}
    })
        .external(paths.dependencies)
        .plugin(tsify)
        .transform(babelify, {presets: ["env"], extensions: [".tsx", ".ts"]})
        .bundle()
        .pipe(vinylSourceStream(appendHashToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulpNgAnnotate())
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulpSourcemaps.mapSources((sourcePath, file) => {
            // change dist/tmp_ts to src
            return "../src/" + sourcePath.substring(12);
        }))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("injectFileNames", () => {
    return gulp.src("./dist/index.html")
        .pipe(gulpInject(gulp.src(["./dist/vendors*.js"]), {relative: true, name: "head"}))
        .pipe(gulpInject(gulp.src(["./dist/**/*js", "./dist/**/*.css", "!./dist/vendors*.js"]), {relative: true}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("start-browsersynch", () => {
    return browserSync.init({
        server: {
            files: ["./dist/**", "!./dist/tmp_ts/**"],
            baseDir: "./dist",
            port: 8008,
        }
    });
});

gulp.task("refresh", () => {
    return browserSync.reload();
});

gulp.task("watch", () => {
    gulp.watch(["./src/**/*.ts"]).on("change", () => {
        runSequence(
            "preprocess-ts",
            "compile-ts-dev",
            "injectFileNames",
            "refresh"
        );
    });
    gulp.watch(["./src/**/*.html"]).on("change", () => {
        runSequence(
            "copy-base-files",
            "cache-uib-templates",
            "cache-html-templates",
            "injectFileNames",
            "refresh"
        );
    });

    gulp.watch(["./src/**/*.scss"]).on("change", () => {
        runSequence(
            "sass-dev",
            "injectFileNames",
            "refresh"
        );
    });
});

gulp.task("empty-tmp-ts", () => {
    return del.sync(["dist/tmp_ts/"]);
});

gulp.task("karma", (done) => {
    return new karmaServer({
        configFile: path.resolve("karma.conf.js"),
        singleRun: true
    }, done).start();
});


/*--------------------------*/
/* Dev                      */
/*--------------------------*/

gulp.task("default", () => {
    runSequence(
        "empty-dist",
        "bootlint",
        "sass-lint",
        ["copy-base-files",
            "copy-locales",
            "cache-uib-templates",
            "cache-html-templates",
            "copy-imgs",
            "copy-fonts",
            "copy-i18n",
            "sass-dev",
            "bundle-vendors"
        ],
        "preprocess-ts",
        "tslint",
        "compile-ts-dev",
        "injectFileNames",
        "start-browsersynch",
        "watch"
    );
});


/*--------------------------*/
/* Unit tests               */
/*--------------------------*/

gulp.task("test", () => {
    runSequence(
        "empty-dist",
        "bootlint",
        "sass-lint",
        ["copy-base-files",
            "copy-locales",
            "cache-uib-templates",
            "cache-html-templates",
            "copy-imgs",
            "copy-fonts",
            "copy-i18n",
            "sass-dev",
            "bundle-vendors"
        ],
        "preprocess-ts",
        "tslint",
        "compile-ts-spec",
        "injectFileNames",
        "empty-tmp-ts"
    );
});


/*--------------------------*/
/* Prod                     */
/*--------------------------*/

gulp.task("prod", () => {
    runSequence(
        "empty-dist",
        "bootlint",
        "sass-lint",
        ["copy-base-files",
            "copy-locales",
            "copy-imgs",
            "copy-fonts",
            "copy-i18n",
            "cache-uib-templates",
            "cache-html-templates",
            "sass-prod",
            "bundle-vendors"
        ],
        "preprocess-ts",
        "tslint",
        "compile-ts-prod",
        "injectFileNames",
        "empty-tmp-ts"
    );
});
