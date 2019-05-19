Welcome to **Consentacles**, a website builder for weirdos.

- Weirdos who care about doing stuff their own way.
- Weirdos who care about writing small packages.
- Weirdos who care about reducing bandwidth.
- Weirdos who care about running quickly.

Consentacles is a website build tool that allows you to write in plain HTML, CSS and JS while intelligently minifying, modularizing, loading and caching your content to make it as quick and small as possible. If you want to build a unique webpage, with the latest native web technologies but don't want to hassle with building your own toolchain, Consentacles is for you.

Check out the quick start below to jump right in; alternatively, explore the Project Structure, Commands or Tutorial.

# Quick Start
```bash
$ npm install -g consentacles
$ consentacles new project hello
$ cd hello
$ consentacles build
$ consentacles serve
```

## Full
**Coming Soon**

Consentacles will help ensure that your website has all the appropriate tags, files, icons, manifests, etc... that modern websites have. If you don't want to bother with all that, then this can be turned off. If you do, Consentacles will help generate these files for you.

## Fast
Consentacles will help you serve your site as quickly as possible.

### Modular
Consentacles helps you organize your files so that resources needed in many places are loaded and cached immediately, and files that are used occasionally are loaded as needed. This also prevents minor updates from invalidating users' cached content

**Coming Soon**
Files can be set to be pre-fetched, so subsequent pages load quicker, without blocking the time to interactivity and first paint of the current page.

### NGINX & Dockerfiles
**Coming Soon**

Consentacles will generate a custom Dockerfile and NGINX configuration for your website. These will allow you to easily deploy your site using minimal resources and taking advantages of all the fine tuning of modern HTTP servers such as:

- HTTP2 & Server Push
- Intelligent Caching
- Latest compression algorithms

will help you build sites that as fast as possible by intelligently modularizing and concatenating your files, while creating a custom NGINX configuration to load them as quickly as possible.

### Site Testing
**Coming Soon**

Consentacles includes tools that will help you measure how fast your webpage loads, time to first paint, time to interactivity, on a variety of browsers to help you further fine tune and optimize your site.

## Small
Consentacles minimizes and obfuscates your files so that they are as small as possible. Source maps are generated that can be used to reverse this process for easier debugging.

## Static
Currently Consentacles is best for sites with _static_ content. 

Nothing stops you from making them dynamic, in fact, SPA applications or other forms of lazy data loaded applications can be built relatively easily with Consentacles, but there is no special tooling to support this or optimizations performed on this loading at this time.

Other types of dynamic sites are not served well by Consentacles as they are better generated and cached server side.

## Unique
Consentacles relies only on HTML, CSS and JS web technologies. While you're free to import whatever components, styling or libraries you desire none of them are required. While frameworks are nice to add structure to a project, they are often unnecessary and cumbersome for small projects, or projects that are different enough that doing things the usual way isn't suitable. Consentacles gives you all the performance advantages of frameworks with none of the overhead.

## Reusable
Consentacles is built on the idea of keeping things DRY. Small code bases are not only maintained easier, but deployed and cached easier. Create pages and web components that can be dropped into any Consentacles project and instantly be integrated.

**Coming Later**
Easily import and reuse native web components with the Consentacles component registry.

**Coming Later**
Reuse HTML with a templating system that allows for the generation of static pages based off of known data.
