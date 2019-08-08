var gulp = require("gulp");
var browserSync = require("browser-sync");
var sass = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var cp = require("child_process");

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task("browser-reload", function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task("browser-sync", ["sass"], function () {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task("sass", function () {
  return gulp
    .src("_sass/*.scss")
    .pipe(
      sass({
        includePaths: ["scss"],
        onError: browserSync.notify("Error in sass")
      })
    )
    .on("error", sass.logError)
    .pipe(
      prefix(["last 15 versions", "> 1%", "ie 8", "ie 7"], { cascade: true })
    )
    .pipe(gulp.dest("css"))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task("watch", function () {
  gulp.watch("_sass/*.scss", ["sass"]);
  gulp.watch(["*.html", "*.js", "*.css"], ["browser-reload"]);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch fsiles.
 */
gulp.task("default", ["browser-sync", "watch"]);
