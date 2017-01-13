var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default',['scripts'])

gulp.task('scripts', function () {
    return gulp.src('src/**.ts')
        .pipe(ts({
            noImplicitAny: true,
            target: "ES6",
            module: 'commonjs'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], function() {
    gulp.watch('src/**.ts', ['scripts']);
});