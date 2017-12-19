var gulp    = require("gulp");
var concat  = require("gulp-concat");

var scripts = require("./scripts");
var styles  = require("./styles");

gulp.task("css", function () {
    gulp.src(styles)
        .pipe(concat("style.css"))
        .pipe(gulp.dest("./public/css"));
});

gulp.task("javascript", function () {
    gulp.src(scripts)
        .pipe(concat("script.js"))
        .pipe(gulp.dest("./public/javascript"));
});

gulp.task("html", function () {
    gulp.src("./src/html/**/*.*")
        .pipe(gulp.dest("./public"));
});

gulp.task("build", function () {
    gulp.start(["css", "javascript", "html"]);
});
