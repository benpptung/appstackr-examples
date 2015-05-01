# appstackr-examples

As an example to see the powerful appstackr

### Install

```
$ git clone https://github.com/benpptung/appstackr-example.git /tmp/appstackr-examples

$ cd /tmp/appstackr-examples/

$ npm install
```

### Develop the project

- Use an IDE or text editor to open the appstackr-example project.
- delete `appstackr-settings.json` if not using Mac
- run the following commands to start

```
$ npm run appstack

$ npm run bsync
```

### Debug

appstackr has no source map. To figure out what's wrong, use the following command to beautify the codes and see where the error is in browser console. Use `stacks.js` as an index, if not sure which source file it is. e.g. to check `example.min.js` 

```
$ npm run appstack -- -bf example:js
```


### Prepare to deploy to CDN

run the following commands

```
$ npm run appbuild

$ npm start
```
Deploy the public files to a CDN server, it's done.


appstackr is just a personal tool, not to replace other famous or popular tools. It is just a tool to save my time to use Grunt/gulp/webpack or other similar tools.
In my opinion, Grunt/gulp is designed for lib development, but not good for web site/app development.