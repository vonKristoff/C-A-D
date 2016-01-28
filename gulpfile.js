// Barebone Dependancies
var gulp        = require('gulp')
,   refresh     = require('gulp-livereload')

// preprocessing
,   jade        = require('gulp-jade')
,   nib         = require('nib')

// utils
,   termstyle   = require('jshint-stylish')
,   jshint      = require('gulp-jshint');


// I/O Script Paths
var paths = {
  jade: ['./jade/views/*.jade'],
  js: ['./js/**/*.js'],
  dest: '../'
};

/**
*   Tasks
**/


// HTML
gulp.task('jade',function() {
  gulp.src(paths.jade)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('../'))
    .pipe(refresh())
})

// JAVASCRIPT
gulp.task('js', ['lint'], function() {
  gulp.src('./js/**/*.js')
    .pipe(gulp.dest(paths.dest + 'js'))
    .pipe(refresh())
})

/**
*   Utils & Tests
**/

// Console debugging
gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(termstyle))
})

/**
*   Process
**/

gulp.task('default', function(){

  refresh.listen();
  
  gulp.watch('./jade/**/*.jade',['jade']);
  gulp.watch('./js/**/*.js',['js']);

});
