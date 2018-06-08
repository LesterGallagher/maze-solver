var closureCompiler = require('google-closure-compiler').gulp();
var sourcemaps = require('gulp-sourcemaps');
var gulp = require('gulp');
var gutil = require('gulp-util');

var prod = process.env.NODE_ENV === 'production';

gulp.task('default', () => {
    return gulp.src('./src/**/*.js', { base: './' })
        .pipe(sourcemaps.init())
        .pipe(closureCompiler({
            js: ['node_modules/heap-tree/heaptree.js'],
            compilation_level: 'SIMPLE',
            warning_level: 'VERBOSE',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT3',
            output_wrapper: '(function(){\n%output%\n}).call(this)',
            js_output_file: 'maze-solver.min.js',
            debug: true,
        }))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('./'));
});

gulp.task('prod', () => {
    return gulp.src('./src/**/*.js', { base: './' })
        .pipe(closureCompiler({
            js: ['node_modules/heap-tree/heaptree.js'],
            compilation_level: 'ADVANCED',
            warning_level: 'VERBOSE',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT3',
            output_wrapper: '(function(){\n%output%\n}).call(this)',
            js_output_file: 'maze-solver.min.js',
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./'));
});

gulp.task('watch', () => {
    return gulp.watch('./src/**/*.js', ['default']);
});