const gulp = require('gulp');
const less = require('gulp-less');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');

const browserSync = require('browser-sync');

const isDevelopment = true;
const debugInfo = false;

gulp.task('less', () => {
    return gulp.src('src/css/**/*.less')
        .pipe(gulpIf(debugInfo, debug({title: 'src'})))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 16 versions'],
            cascade: false
        }))
        .pipe(less())
        .pipe(concat('bundle.css'))
        // .pipe(cleanCss())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});
gulp.task('sass', () => {
    return gulp.src('src/css/**/*.scss')
        .pipe(gulpIf(debugInfo, debug({title: 'src'})))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 16 versions'],
            cascade: false
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(cleanCss())
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});
gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('public/js'));
});
gulp.task('php', () => {
    return gulp.src('src/**/*.php')
        .pipe(gulp.dest('public'));
});
gulp.task('css', () => {
    return gulp.src('src/css/*.css')
        .pipe(gulp.dest('public/css'));
});
gulp.task('img', () => {
    return gulp.src('src/img/**/*.+(png|jpg|jpeg|svg)')
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('public/img'));
});
gulp.task('fonts', () => {
    return gulp.src('src/fonts/**/*.+(css|eot|otf|svg|ttf|woff)')
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './public'
        }
    });
    // gulp.watch('src/css/**/*.less', gulp.series('less'));
    gulp.watch('src/css/**/*.scss', gulp.series('sass'));
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/*.php', gulp.series('php'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
    gulp.watch('src/img/**/*.+(png|jpg|jpeg|svg)', gulp.series('img'));
    gulp.watch('src/fonts/**/*.+(css|eot|otf|svg|ttf|woff)', gulp.series('fonts'));
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('default',
    gulp.series(
        // 'less',
        'sass',
        'html',
        'fonts',
        'img',
        'css',
        'js',
        'php',
        'serve'
    ));
