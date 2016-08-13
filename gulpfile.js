 var gulp = require("gulp");
 var task = require('require-dir')('./tasks');

 gulp.task('default', ['bundler', 'compress', 'gamesync']);