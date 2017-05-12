
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
const gulpCleanCSS = require("gulp-clean-css");
const gulpFlatten = require("gulp-flatten");
const gulpInject = require("gulp-inject");
const gulpNgAnnotate = require("gulp-ng-annotate");
const gulpPreprocess = require("gulp-preprocess");
const gulpRename = require("gulp-rename");
const gulpReplace = require("gulp-replace");
const gulpSass = require("gulp-sass");
const gulpSourcemaps = require("gulp-sourcemaps");
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
const strictDi = yargs.argv.strictDi;

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
    sass: ["src/main.scss"],
    imgs: ["src/assets*/imgs/**/"],
    fonts: [
        "src/assets/fonts/**/",
        "node_modules/bootstrap-sass/assets/fonts/**/",
        "node_modules/font-awesome/fonts/**/"
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
        "angular-ui-bootstrap",
        "angular-ui-router",
        "angular-ui-scroll",
        "babel-polyfill",
        "bootstrap-sass",
        "format4js",
        "ng-infinite-scroll",
        "stacktrace-js"
    ],
    i18n: [
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

function appendVersionToFileName(fileName) {
    return fileName.substring(0, fileName.lastIndexOf(".")) + "-" + version + fileName.substring(fileName.lastIndexOf("."));
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

gulp.task("copy-base-files", () => {
    return gulp.src(paths.baseFiles)
        .pipe(gulpPreprocess({
            context: {"VERSION": version}
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-i18n", () => {
    return gulp.src(paths.i18n)
        .pipe(gulp.dest("dist/lib/"));
});

gulp.task("cache-uib-templates", () => {
    return gulp.src(paths.uibTemplates)
        .pipe(gulpRename((path) => {
            const arr = path.dirname.split("/");
            path.dirname = arr[arr.length - 1] || arr[arr.length - 2];
        }))
        .pipe(gulpAngularTemplateCache(appendVersionToFileName("uibtemplates.js"), {
            root: "uib/template",
            module: "ui.bootstrap.tpls",
            standalone: false
        }))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("cache-html-templates", () => {
    return gulp.src(paths.htmlTemplates)
        .pipe(gulpRename({dirname: ""}))
        .pipe(gulpAngularTemplateCache(appendVersionToFileName("templates.js"), {
            root: "",
            module: "app-templates",
            standalone: true
        }))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("copy-imgs", () => {
    return gulp.src(paths.imgs)
        .pipe(gulpFlatten())
        .pipe(gulp.dest("dist/imgs/"));
});

gulp.task("copy-fonts", () => {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest("dist/fonts/"));
});

gulp.task("sass-dev", () => {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpRename(appendVersionToFileName("app.css")))
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("sass-prod", () => {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpCleanCSS({debug: true}, (details) => {
            console.log(details.name + ": " + details.stats.originalSize);
            console.log(details.name + ": " + details.stats.minifiedSize);
        }))
        .pipe(gulpRename(appendVersionToFileName("app.css")))
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("bundle-vendors", () => {
    return browserify()
        .require(paths.dependencies)
        .bundle()
        .pipe(vinylSourceStream(appendVersionToFileName("vendors.js")))
        .pipe(vinylBuffer())
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("preprocess-ts", () => {
    return gulp.src(paths.preprocessTs)
        .pipe(gulpPreprocess({
            includeExtensions: [".tsx", ".ts"],
            context: {"MOCK_BACKEND": mock, "STRICT_DI": strictDi}
        }))
        .pipe(gulp.dest("dist/tmp_ts/"));
});

gulp.task("tslint", () => {
    return gulp.src("dist/tmp_ts/**/")
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
        .transform(babelify, {presets: ["es2015"], extensions: [".tsx", ".ts"]})
        .bundle()
        .on("error", (e) => {
            gulpUtil.log(gulpUtil.colors.red("Bundle error:", e.message));
        })
        .pipe(vinylSourceStream(appendVersionToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("compile-ts-spec", () => {
    return browserify({
        basedir: ".",
        entries: paths.browserifyEntries.concat(glob.sync("dist/tmp_ts/**/*.spec.ts")),
        cache: {},
        packageCache: {}
    })
        .external(paths.dependencies)
        .plugin(tsify)
        .transform(babelify, {presets: ["es2015"], extensions: [".tsx", ".ts"]})
        .bundle()
        .pipe(vinylSourceStream(appendVersionToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("compile-ts-prod", () => {
    return browserify({
        basedir: ".",
        cache: {},
        entries: paths.browserifyEntries,
        packageCache: {}
    })
        .external(paths.dependencies)
        .plugin(tsify)
        .transform(babelify, {presets: ["es2015"], extensions: [".tsx", ".ts"]})
        .bundle()
        .pipe(vinylSourceStream(appendVersionToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulpNgAnnotate())
        .pipe(gulpSourcemaps.init({loadMaps: true}))
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulpSourcemaps.write("./"))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("fix-map-file", () => {
    return gulp.src(["./dist/tmp_ts/*.map"])
        .pipe(gulpReplace("dist/tmp_ts", "src"))
        .pipe(gulp.dest("./dist/js/"));
});

gulp.task("injectFileNames", () => {
    return gulp.src("./dist/index.html")
        .pipe(gulpInject(gulp.src(["./dist/js/vendors*.js"]), {relative: true, name: "head"}))
        .pipe(gulpInject(gulp.src(["./dist/js/**/*js", "./dist/css/**/*.css", "!./dist/js/vendors*.js"]), {relative: true}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("start-browsersynch", () => {
    return browserSync.init({
        server: {
            files: ["./dist/**", "!./dist/tmp_ts/**"],
            baseDir: "./dist"
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
            // "fix-map-file",
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
        ["copy-base-files",
            "copy-i18n",
            "cache-uib-templates",
            "cache-html-templates",
            "copy-imgs",
            "copy-fonts",
            "sass-dev",
            "bundle-vendors"
        ],
        "preprocess-ts",
        "tslint",
        "compile-ts-dev",
        // "fix-map-file",
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
        ["copy-base-files",
            "copy-i18n",
            "cache-uib-templates",
            "cache-html-templates",
            "copy-imgs",
            "copy-fonts",
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
        ["copy-base-files",
            "copy-i18n",
            "copy-imgs",
            "copy-fonts",
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
