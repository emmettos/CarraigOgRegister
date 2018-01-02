var gulp        = require("gulp");
var concat      = require("gulp-concat");
var rename      = require("gulp-rename");
var uglify      = require("gulp-uglify");
var cleanCSS    = require("gulp-clean-css");
var plumber     = require("gulp-plumber");

var scripts = require("./scripts");
var styles  = require("./styles");

gulp.task("css", function () {
    gulp.src([
            "./libs/bootstrap/fonts/*.*",
            "./libs/font-awesome/fonts/*.*"
        ])
        .pipe(gulp.dest("./public/fonts"));

    gulp.src(styles)
        .pipe(plumber())
        .pipe(concat("styles.css"))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("scripts", function () {
    gulp.src(scripts)
        .pipe(plumber())
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/javascript/"));
});

gulp.task("html", function () {
    gulp.src("./src/html/**/*.*")
        .pipe(gulp.dest("./public"));
});

gulp.task("build", function () {
    gulp.start(["html", "css", "scripts"]);
});
