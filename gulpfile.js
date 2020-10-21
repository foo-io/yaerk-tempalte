let PROJECT_FOLDER = 'dist';
let SOURCE_FOLDER = 'src';

let path = {
    build: {
        html: PROJECT_FOLDER + '/',
        css: PROJECT_FOLDER + '/css/',
        js: PROJECT_FOLDER + '/js/',
        img: PROJECT_FOLDER + '/img/',
        fonts: PROJECT_FOLDER + '/fonts/'
    },
    src: {
        html: [SOURCE_FOLDER + '/*.html', '!' + SOURCE_FOLDER + '/_*.html', '!' + SOURCE_FOLDER + '/template.*.html'],
        css: SOURCE_FOLDER + '/scss/style.scss',
        js: [SOURCE_FOLDER + '/js/*.js', '!' + SOURCE_FOLDER + '/js/_*.js',],
        img: SOURCE_FOLDER + '/img/**/*.{png,jpg,ico,gif,svg,webp}',
        fonts: SOURCE_FOLDER + '/fonts/*.{ttf,eot,woff}'
    },
    watch: {
        html: SOURCE_FOLDER + '/**/*.html',
        css: SOURCE_FOLDER + '/scss/**/*.scss',
        js: SOURCE_FOLDER + '/js/**/*.js',
        img: SOURCE_FOLDER + '/img/**/*.{png,jpg,ico,gif,svg,webp}'
    },
    clean: './' + PROJECT_FOLDER + '/'
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    svgSprite = require('gulp-svg-sprite'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + PROJECT_FOLDER + '/'
        },
        port: 3000,
        notify: false
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(group_media())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0-7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(params) {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

gulp.task('svgSprite', function () {
    return gulp.src([ SOURCE_FOLDER + '/icons/*.svg' ])
        .pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
				$('[opacity]').removeAttr('opacity');
			},
			parserOptions: {xmlMode: true}
		}))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../icons/sprite.svg', // название файла иконок
                    example: true,
                    // prefix: '.svg--%s',
                    render: {
                        scss: true
                        // scss: {
                        //     dest: "../../../scss/_sprite.scss",
                        //     template: SOURCE_FOLDER + "scss/_sprite_template.scss"
                        // }
                    }
                }
            }
        }))
        .pipe(dest(path.build.img))
})

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
