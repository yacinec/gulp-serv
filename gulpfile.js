var gulp			= require('gulp');
var browserSync		= require('browser-sync').create();
var sass			= require('gulp-sass');

var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var browserify = require('browserify')
var rename = require('gulp-rename');
/*var gulpify = require('gulpify');
var rename = require('gulp-rename');*/


gulp.task('html', function() {
	return gulp.src('./build/html/*.html')
		.pipe(gulp.dest("./public"))
		.pipe(browserSync.stream());
});

gulp.task('js', function() {
	var bundleStream = browserify('./build/js/main.js').bundle();

	return bundleStream
		.pipe(source('./build/js/main.js'))
		.pipe(streamify(uglify()))
		.pipe(rename('vendor.js'))
		.pipe(gulp.dest('./public/js'));
	
});

gulp.task('js-watch', gulp.series(['js']), function(done) {
	browserSync.reload();
	done();
});

gulp.task('sass', function() {
	return gulp.src('./build/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest("./public/css"))
		.pipe(browserSync.stream());
});


gulp.task('build', gulp.series(['html', 'sass', 'js']));

gulp.task('serve', function() {

	browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

	gulp.watch('build/js/*.js', gulp.series(['js-watch']));
	gulp.watch('build/html/*.html').on('change', gulp.series(['html']), browserSync.reload());
	gulp.watch('build/scss/*.scss').on('change', gulp.series(['sass']));
});

gulp.task('default', gulp.series(['build', 'serve']));