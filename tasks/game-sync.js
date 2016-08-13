var gulp = require("gulp");
var browserSync = require('browser-sync').create();
gulp.task("gamesync", function() {
    browserSync.init({
        server: "./public/game/dist"
    });

    gulp.watch("public/game/dist/index.html").on('change', browserSync.reload);
    gulp.watch("public/game/dist/bundlejs/index.js").on('change', browserSync.reload);
});