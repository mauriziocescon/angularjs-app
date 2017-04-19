
/*--------------------------*/
/* Build scripts            */
/*--------------------------*/

var babelify = require("babelify");
var browserify = require("browserify");
var browserSync = require("browser-sync").create();
var del = require("del");
var fs = require("fs");
var glob = require("glob");
var gulp = require("gulp");
var gulpAngularTemplateCache = require("gulp-angular-templatecache");
var gulpCleanCSS = require("gulp-clean-css");
var gulpFlatten = require("gulp-flatten");
var gulpInject = require("gulp-inject");
var gulpNgAnnotate = require("gulp-ng-annotate");
var gulpPreprocess = require("gulp-preprocess");
var gulpRename = require("gulp-rename");
var gulpReplace = require("gulp-replace");
var gulpSass = require("gulp-sass");
var gulpUglify = require("gulp-uglify");
var gulpUtil = require("gulp-util");
var karmaServer = require("karma").Server;
var path = require("path");
var runSequence = require("run-sequence");
var tsify = require("tsify");
var vinylBuffer = require("vinyl-buffer");
var vinylSourceStream = require("vinyl-source-stream");
var watchify = require("watchify");
var yargs = require("yargs");

var package = JSON.parse(fs.readFileSync("./package.json"));
var version = package.version;
var mock = yargs.argv.mock;
var strictDi = yargs.argv.strictDi;

var paths = {
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
        "angular-mocks",
        "angular-sanitize",
        "angular-touch",
        "bootstrap-sass",
        "angular-dynamic-locale",
        "angular-loading-bar",
        "angular-stats",
        "angular-ui-bootstrap",
        "angular-ui-router",
        "angular-ui-scroll",
        "babel-polyfill",
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

var watchedBrowserify = watchify(browserify({
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

gulp.task("empty-dist", function () {
    return del.sync(["dist/**/*"]);
});

gulp.task("copy-base-files", function () {
    return gulp.src(paths.baseFiles)
        .pipe(gulpPreprocess({
            context: {"VERSION": version}
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("copy-i18n", function () {
    return gulp.src(paths.i18n)
        .pipe(gulp.dest("dist/lib/"));
});

gulp.task("cache-uib-templates", function () {
    return gulp.src(paths.uibTemplates)
        .pipe(gulpRename(function (path) {
            var arr = path.dirname.split("/");
            path.dirname = arr[arr.length - 1] || arr[arr.length - 2];
        }))
        .pipe(gulpAngularTemplateCache(appendVersionToFileName("uibtemplates.js"), {
            root: "uib/template",
            module: "ui.bootstrap.tpls",
            standalone: false
        }))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("cache-html-templates", function () {
    return gulp.src(paths.htmlTemplates)
        .pipe(gulpRename({dirname: ""}))
        .pipe(gulpAngularTemplateCache(appendVersionToFileName("templates.js"), {
            root: "",
            module: "app-templates",
            standalone: true
        }))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("copy-imgs", function () {
    return gulp.src(paths.imgs)
        .pipe(gulpFlatten())
        .pipe(gulp.dest("dist/imgs/"));
});

gulp.task("copy-fonts", function () {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest("dist/fonts/"));
});

gulp.task("sass-dev", function () {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpRename(appendVersionToFileName("app.css")))
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("sass-prod", function () {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on("error", gulpSass.logError))
        .pipe(gulpCleanCSS({debug: true}, function (details) {
            console.log(details.name + ": " + details.stats.originalSize);
            console.log(details.name + ": " + details.stats.minifiedSize);
        }))
        .pipe(gulpRename(appendVersionToFileName("app.css")))
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("bundle-vendors", function () {
    return browserify()
        .require(paths.dependencies)
        .bundle()
        .pipe(vinylSourceStream(appendVersionToFileName("vendors.js")))
        .pipe(vinylBuffer())
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("preprocess-ts", function () {
    return gulp.src(paths.preprocessTs)
        .pipe(gulpPreprocess({
            includeExtensions: [".tsx", ".ts"],
            context: {"MOCK_BACKEND": mock, "STRICT_DI": strictDi}
        }))
        .pipe(gulp.dest("dist/tmp_ts/"));
});

gulp.task("compile-ts-dev", function () {
    return watchedBrowserify
        .transform(babelify, {presets: ["es2015"], extensions: [".tsx", ".ts"]})
        .bundle()
        .on("error", function (e) {
            gulpUtil.log(gulpUtil.colors.red("Bundle error:", e.message));
        })
        .pipe(vinylSourceStream(appendVersionToFileName("app.js")))
        .pipe(vinylBuffer())
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("compile-ts-spec", function () {
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

gulp.task("compile-ts-prod", function () {
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
        .pipe(gulpUglify({mangle: false}))
        .pipe(gulp.dest("dist/js/"));
});

gulp.task("fix-map-file", function () {
    return gulp.src(["./dist/tmp_ts/*.map"])
        .pipe(gulpReplace("dist/tmp_ts", "src"))
        .pipe(gulp.dest("./dist/js/"));
});

gulp.task("injectFileNames", function () {
    return gulp.src("./dist/index.html")
        .pipe(gulpInject(gulp.src(["./dist/js/vendors*.js"]), {relative: true, name: "head"}))
        .pipe(gulpInject(gulp.src(["./dist/js/**/*js", "./dist/css/**/*.css", "!./dist/js/vendors*.js"]), {relative: true}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("start-browsersynch", function () {
    return browserSync.init({
        server: {
            files: ["./dist/**", "!./dist/tmp_ts/**"],
            baseDir: "./dist"
        }
    });
});

gulp.task("refresh", function() {
    return browserSync.reload();
});

gulp.task("watch", function () {
    gulp.watch(["./src/**/*.ts"]).on("change", function () {
        runSequence(
            "preprocess-ts",
            "compile-ts-dev",
            "fix-map-file",
            "injectFileNames",
            "refresh"
        );
    });
    gulp.watch(["./src/**/*.html"]).on("change", function () {
        runSequence(
            "copy-base-files",
            "cache-uib-templates",
            "cache-html-templates",
            "injectFileNames",
            "refresh"
        );
    });

    gulp.watch(["./src/**/*.scss"]).on("change", function () {
        runSequence(
            "sass-dev",
            "injectFileNames",
            "refresh"
        );
    });
});

gulp.task("empty-tmp-ts", function () {
    return del.sync(["dist/tmp_ts/"]);
});

gulp.task("karma", function (done) {
    return new karmaServer({
        configFile: path.resolve("karma.conf.js"),
        singleRun: true
    }, done).start();
});


/*--------------------------*/
/* Dev                      */
/*--------------------------*/

gulp.task("default", function () {
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
        "compile-ts-dev",
        "fix-map-file",
        "injectFileNames",
        "start-browsersynch",
        "watch"
    );
});


/*--------------------------*/
/* Unit tests               */
/*--------------------------*/

gulp.task("test", function () {
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
        "compile-ts-spec",
        "injectFileNames",
        "empty-tmp-ts"
    );
});


/*--------------------------*/
/* Prod                     */
/*--------------------------*/

gulp.task("prod", function () {
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
        "compile-ts-prod",
        "injectFileNames",
        "empty-tmp-ts"
    );
});