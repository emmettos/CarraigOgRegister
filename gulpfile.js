var gulp        = require("gulp");
var concat      = require("gulp-concat");
var rename      = require("gulp-rename");
var uglify      = require("gulp-uglify");
var cleanCSS    = require("gulp-clean-css");
var plumber     = require("gulp-plumber");
var revAll      = require("gulp-rev-all");
var filter      = require("gulp-filter");
var gulpSync    = require("gulp-sync")(gulp);

var scripts = require("./scripts");
var styles  = require("./styles");

gulp.task("css", function () {
    var fontFilter = filter(["**/*.eot", "**/*.svg", "**/*.ttf", "**/*.woff", "**/*.woff2"], { restore: true }),
        cssFilter = filter(["**/*.css"]);

    return gulp.src(styles)
        .pipe(plumber())
        .pipe(fontFilter)
        .pipe(gulp.dest("./public/fonts"))
        .pipe(fontFilter.restore)
        .pipe(cssFilter)
        .pipe(concat("styles.css"))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("scripts", function () {
    return gulp.src(scripts)
        .pipe(plumber())
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("./public/javascript/"));
});

gulp.task("html", function () {
    return gulp.src("./src/html/**/*.*")
        .pipe(gulp.dest("./public"));
});

gulp.task("version", function () {
    return gulp.src([
            "./public/javascript/scripts.min.js",
            "./public/css/styles.min.css",
            "./public/index.html"
        ])
        .pipe(plumber())
        .pipe(revAll.revision({
            dontRenameFile: ["index.html"]
        }))
        .pipe(gulp.dest("./public"));
});

gulp.task("build", gulpSync.sync([
    [
        "css", 
        "html", 
        "scripts"
    ], 
    "version"
]));
