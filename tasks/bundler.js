var gulp = require("gulp");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var watchify = require("watchify");
gulp.task("bundler", function() {
    var bundler = watchify(browserify({
        entries: ['./public/game/game.js'],
        extensions: ['.js'],
        debug: true,
        packageCache: {},
        fullPaths: true
    }));


    function build(file) {
        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, "browserify error"))
            .pipe(source('index.js'))
            .pipe(gulp.dest('./public/game/dist/bundlejs'));
    };

    build();
    bundler.on('update', build);
});