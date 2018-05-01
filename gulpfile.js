var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat');


gulp.task('htm', function () {
    gulp.src('src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    gulp.src('src/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    gulp.src('src/js/*.js')
        //.pipe(uglify()) //i commented this to remain the js readable
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['htm', 'css', 'js']);
