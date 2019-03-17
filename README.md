Meet **Set** a minimalist framework for building fast web sites and apps.

Set will export your web app using NGINX or Express, optionally Dockerized.

Set is for developers that want to build websites and apps without having to conform to particular protocol, but don't want to worry about setting up a toolchain/workspace to convert src/ to dist/

Set is for developers that care about fast initial load times.

Set is for developers that want to build a website using modern web technologies without having to import a massive framework like Angular, React or Vue.

## Goals

- Easily create new pages and routes with a generator
- Easily create a new project using templates
- Easily deploy the finished product
- Easily integrate other packages
- Easily test your code

## Technology
**Web Components:** Generates self container web components, while allowing the the HTML and CSS in separate files.
**Scripting:** Use either TypeScript of ES6. Compiles down to ES6.
**Styling:** Use SCSS/SASS or CSS3. Compiles down to CSS3.

## Serving
Set will provide you with a NGINX conf file to serve a static site, or create a simple Express server to serve it for you. Optionally, these can be Dockerized and Set will provide a Docker file that can be used to build an image that can server your site.

## Options & Flags

- new [project|route|component] <name>
- help
- build
- serve (port)
