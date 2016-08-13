var uglify = require('gulp-uglifyjs');
var gulp = require('gulp');

gulp.task('compress', function() {
    gulp.src('public/game/dist/bundlejs/index.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/game/dist'));
});