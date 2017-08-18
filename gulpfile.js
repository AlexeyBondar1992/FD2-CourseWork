let gulp = require('gulp');
let concat = require('gulp-concat');

gulp.task('scripts', function () {
    return gulp.src('scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/'));

});
