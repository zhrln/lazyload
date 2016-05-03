/**
 * Created by yanjing<yanjing.zr@alibaba-inc.com> on Tue May 03 2016.
 */
var gulp = require("gulp");
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var concat = require('gulp-concat');
var umdwrap = require('gulp-ngm-umdwrap');

var buildPath = './build';

var depSrc = [];

var umdwrapOption = {
    exp: "window.lib['ngLazyload']"
};

gulp.task('common', function () {
    gulp.src(['./src/ng-lazyload.js'])
        .pipe(umdwrap(umdwrapOption, 'commonjs'))
        .pipe(concat('ng-lazyload.common.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});

gulp.task('amd', function () {
    gulp.src(['./src/ng-lazyload.js'])
        .pipe(umdwrap(umdwrapOption, 'amd'))
        .pipe(concat('ng-lazyload.amd.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});

gulp.task('compress', function () {
    gulp.src(['./src/ng-lazyload.js'])
        .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});

gulp.task('debug', function () {
    gulp.src(['./src/ng-lazyload.js'])
        .pipe(concat('ng-lazyload.debug.js'))
        .pipe(gulp.dest(buildPath));
});

gulp.task('dep-compress', function(){
    gulp.src(depSrc)
        .pipe(concat('dep.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildPath));
});

gulp.task('dep-debug', function () {
    gulp.src(depSrc)
        .pipe(concat('dep.debug.js'))
        .pipe(gulp.dest(buildPath));
});

gulp.task('clean', function () {
    return gulp.src(buildPath + '/*')
        .pipe(clean());
});

gulp.task("app", function(){
    gulp.start("common", "amd", "debug", "compress");
});

gulp.task("dep", function(){
    gulp.start("dep-compress", "dep-debug");
});

gulp.task("build", ["clean"], function(){
    if(depSrc.length){
        gulp.start("app", "dep");
    }else{
        gulp.start("app");
    }
});

gulp.task("default", ["build"]);
