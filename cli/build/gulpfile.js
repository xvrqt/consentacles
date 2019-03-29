const gulp = require("gulp");
const debug = require('gulp-debug');

const del = require("del");
const watch = require("gulp-watch");

/* Packages for modifying the HTML */
const inject = require('gulp-inject-inline');

/*************
 * CONSTANTS *
 *************/

/* If true, the program exits and returns -1 on errors */
const build_mode = (process.env.MODE === 'build');

/* Root directory of the source files */
const src = "src";

/* Root directory of the build */
const dist = "dist";

/* Create and store source maps in a './maps' directory relative to the
 * destionation of the files. For TS, JS & SCSS
 */
const sourcemaps = require("gulp-sourcemaps");
const source_maps = "./maps";

/* Used to generate the site map */
const site_url = "https://web-starter.xvrqt.com";

/*********************
 * UTILITY FUNCTIONS *
 *********************/
function generateImageGlobs(dir_path, types) {
    if(types === undefined) {
        types = [
            "jpg",
            "jpeg",
            "gif",
            "png",
            "svg",
            "webp"
        ];
    }

    const globs = [];
    for(let i = 0; i < types.length; i++) {
        const type = types[i];
        globs.push(`${dir_path}/**/*.${type}`);
    }

    return globs;
}

/********************
 * HELPER FUNCTIONS *
 ********************/

/* TypeScript */
const ts = require("gulp-typescript");
/* Use the compiler options specified in tsconfig.json */
const ts_config_location = __dirname + "/tsconfig.json";
const pages_ts_project      = ts.createProject(ts_config_location);
const scripts_ts_project    = ts.createProject(ts_config_location);
const components_ts_project = ts.createProject(ts_config_location);

/* Transpiles TS into JS 
 * REQ: String specifying the files to transpile
 * RET: Stream of Vinyl objects of JS and their source maps 
 */
function transpileTS(glob, ts_project, fail_on_error) {
    return gulp.src(glob)
        .pipe(sourcemaps.init())
        .pipe(ts_project(ts.reporter.fullReporter()))
        .on("error", (error) => {
            console.log(error.toString());
            if(fail_on_error) { process.exit(1); }
        });
}

/* Minify JS */
const terser = require("gulp-terser");
const terser_config = {
    ecma: 6,
    toplevel: true,
    mangle: true,
    compress: {
        booleans_as_integers: true,
        drop_console: build_mode
    }
}

/* Minifies JS and writes to destination with source maps 
 * REQ: Stream of js files as Vinyl objects
 * RET: Stream of Vinyl objects of JS and their source maps 
*/
function minifyJS(stream) {
    return stream
        .pipe(terser(terser_config))
        .pipe(sourcemaps.write(source_maps))
}

/* Minify HTML */
const html_min = require('gulp-htmlmin');
const remove_html_comments = require('gulp-remove-html-comments');

/* Removes whitespace and comments from HTML
 * REQ: String specifying the files to transpile
 * RET: Stream of Vinyl objects 
*/
function minifyHTML(glob) {
    return gulp.src(glob)
        .pipe(remove_html_comments())
        .pipe(html_min({collapseWhitespace: true}));
}

/* Transpile SCSS */
const sass = require("gulp-sass");

const sass_options = {
    outputStyle: 'compressed',
    includePaths: [
        `./${src}/styles/**/*.scss`
    ]
};

const clean_css_config = {
    inline: ['all'],
    level: 2
};

/* Transpiles SCSS to CSS
 * REQ: Stream of CSS files as Vinyl objects
 * RET: Stream of Vinyl objects of CSS and their source maps 
*/
function transpileSCSS(glob, fail_on_error) {
    return gulp.src(glob)
            .pipe(sourcemaps.init())
            .pipe(sass().on("error", (error) => {
                console.log(error.toString());
                if(fail_on_error) { process.exit(1); }
            }));
}

/* Minify CSS */
const clean_css = require("gulp-clean-css");

/* Minifies CSS
 * REQ: Stream of CSS files as Vinyl objects
 * RET: Stream of Vinyl objects of CSS and their source maps 
*/
function minifyCSS(stream) {
    return stream
            .pipe(clean_css({clean_css_config}));
}

/*********
 * CLEAN *
 *********/

/* Removes everything in dist/ */
gulp.task("clean:all", () => {
    return del(`${dist}/*`);
});

/********
 * HTML *
 ********/

const loose_html = [`${src}/**/*.html`, `\!${src}/pages/**/*.html`, `\!${src}/components/**/*.html`];

/* Copy and minify loose HTML (most notably: index.html) */
gulp.task("html:loose", () => {
    return minifyHTML(loose_html)
            .pipe(gulp.dest(dist));
});

gulp.task("html", gulp.parallel("html:loose"));

/***********
 * TS & JS *
 ***********/

const scripts_src_ts = [`${src}/**/*.ts`, `\!${src}/pages/**/*.ts`, `\!${src}/components/**/*.ts`];
const scripts_src_js = [`${src}/**/*.js`, `\!${src}/pages/**/*.js`, `\!${src}/components/**/*.js`];

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("scripts:ts", () => {
    /* Transpile the code */
    const js_code = transpileTS(scripts_src_ts, scripts_ts_project, build_mode);

    /* Minify the code */
    return minifyJS(js_code.js)
            .pipe(gulp.dest(dist));
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("scripts:js", () => {
    /* Minify the code */
    return minifyJS(gulp.src(scripts_src_js))
            .pipe(gulp.dest(dist));
});

gulp.task("scripts", gulp.parallel("scripts:ts", "scripts:js"));

/**********
 * STYLES *
 **********/

const loose_css_styles = [`${src}/**/*.css`, `\!${src}/pages/**/*.css`, `\!${src}/components/**/*.css`];
const loose_scss_styles = [`${src}/**/*.scss`, `\!${src}/pages/**/*.scss`, `\!${src}/components/**/*.scss`];
const loose_styles = loose_css_styles.concat(loose_scss_styles);

/* Transpiles and minifies all loose SCSS and CSS files (most notably: styles.scss) */
gulp.task("styles", () => {
    const css = transpileSCSS(loose_styles, build_mode);
    return minifyCSS(css)
            .pipe(sourcemaps.write(source_maps))
            .pipe(gulp.dest(dist));
});

/*********
 * FONTS *
 *********/

/* Copy all the files in meta/ into the root level of dist/ */
const font_src = `${src}/styles/fonts/**/*`;

gulp.task("fonts:copy", () => {
    return gulp.src(font_src)
            .pipe(gulp.dest(`${dist}/styles/fonts`));
});

gulp.task("fonts", gulp.parallel("fonts:copy"));

/*********
 * PAGES *
 *********/
const pages_js     = `${src}/pages/**/*.js`;
const pages_ts     = `${src}/pages/**/*.ts`;
const pages_htmls  = `${src}/pages/**/*.html`;
const pages_styles = [`${src}/pages/**/*.css`, `${src}/pages/**/*.scss`];

/* Copy, minify and partially flatten HTML in the pages/ directory. */
gulp.task("pages:html", () => {
    return minifyHTML(pages_htmls)
        .pipe(gulp.dest(dist));
});

/* Transpiles and minifies all loose SCSS and CSS files (most notably: styles.scss) */
gulp.task("pages:styles", () => {
    const css = transpileSCSS(pages_styles, build_mode);
    return minifyCSS(css)
            .pipe(sourcemaps.write(source_maps))
            .pipe(gulp.dest(dist));
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("pages:scripts:ts", () => {
    /* Transpile the code */
    const js_code = transpileTS(pages_ts, pages_ts_project, build_mode);

    /* Minify the code */
    return minifyJS(js_code.js)
            .pipe(gulp.dest(dist));
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("pages:scripts:js", () => {
    /* Minify the code */
    return minifyJS(gulp.src(pages_js))
            .pipe(gulp.dest(dist));
});

/* Copy any images in pages/ to <pagename>/image.png */
const pages_images_src = generateImageGlobs(`${src}/pages`);

gulp.task("pages:images", () => {
    return gulp.src(pages_images_src)
            .pipe(gulp.dest(dist));
});
gulp.task("pages:scripts", gulp.parallel("pages:scripts:ts", "pages:scripts:js"));

gulp.task("pages", gulp.parallel("pages:html", "pages:scripts", "pages:styles", "pages:images"));

/**************
 * Components *
 **************/

const components_ts     = `${src}/components/**/*.ts`;
const components_js     = `${src}/components/**/*.js`;
const components_html   = `${src}/components/**/*.html`;
const components_styles = [`${src}/components/**/*.css`, `${src}/components/**/*.scss`];

const components_dist   = `${dist}/components/**/*.js`;
const components_path   = `${dist}/components`;
   
/* Minify the HTML */
gulp.task("components:prepare:html", () => {
    return minifyHTML(components_html)
        .pipe(gulp.dest(components_path));
});

/* Transpile the stylings */
gulp.task("components:prepare:styles", () => {
    const css = transpileSCSS(components_styles, build_mode);
    return minifyCSS(css)
        .pipe(gulp.dest(components_path));
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("components:scripts:ts", () => {
    /* Transpile the code */
    const js_code = transpileTS(components_ts, components_ts_project, build_mode);

    /* Minify the code */
    return minifyJS(js_code.js)
        .pipe(gulp.dest(components_path));
});

/* Transpiles the TypeScript to ES6, minifies it, and moves it to dist/ */
gulp.task("components:scripts:js", () => {
    /* Minify the code */
    return minifyJS(gulp.src(components_js))
        .pipe(gulp.dest(components_path));
});

/* Inject the HTML and Styling into component script */
gulp.task("components:inject", () => {
    return gulp.src(components_dist)
        .pipe(inject())
        .pipe(gulp.dest(components_path));
});

gulp.task("components", gulp.series(gulp.parallel("components:prepare:html", "components:prepare:styles", "components:scripts:ts", "components:scripts:js"), "components:inject"));

/*********
 * ICONS *
 *********/

/* Generate icons for all devices */
const favicons = require("gulp-favicons");
const favicons_config = require("./favico.config.js");

const icons_src  = `${src}/icons/source.png`;
const icons_dist = `${dist}/icons`;

/* Transform the source image into all the various icon sizes */
gulp.task("icons", () => {
    return gulp.src(icons_src)
        .pipe(favicons(favicons_config))
        .pipe(gulp.dest(icons_dist));
});

/**********
 * IMAGES *
 **********/

const images_src = generateImageGlobs(`${src}/images`);
const images_dist = `${dist}/images`;

gulp.task("images", () => {
    return gulp.src(images_src)
            .pipe(gulp.dest(images_dist));
});

/************
 * METADATA *
 ************/

/* Copy all the files in meta/ into the root level of dist/ */
const meta_src = `${src}/meta/**/*`;

gulp.task("meta:copy", () => {
    return gulp.src(meta_src)
            .pipe(gulp.dest(dist));
});

/* Create a site map. This must be run _after_ all the html tasks have completed. */
const sitemap = require("gulp-sitemap");
const html_pages_dist = `${dist}/**/*.html`;

gulp.task("meta:sitemap", () => {
    return gulp.src(html_pages_dist)
            .pipe(sitemap({siteUrl: site_url}))
            .pipe(gulp.dest(dist));
});
gulp.task("meta", gulp.parallel("meta:copy", "meta:sitemap"));

/* Root Tasks */
gulp.task("default", gulp.series("clean:all", gulp.parallel("html", "scripts", "styles", "fonts", "icons", "images", "pages", "components"), "meta"));
