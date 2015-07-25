# appstackr-examples

As an example to see the powerful appstackr

### Install

```
$ git clone https://github.com/benpptung/appstackr-examples.git /tmp/appstackr-examples

$ cd /tmp/appstackr-examples/

$ npm install
```

### Developing the project under browser-sync

```
$ npm run appstack

$ npm run bsync
```

Use an IDE or text editor to open the appstackr-example project. Edit the files under `client` or `views` folder. e.g. `views/index.swig`

### Run with a CDN server


```
$ npm run appbuild

$ npm run cdn
```

A temp cdn server is running on port 3001 now

Open another shell, run the following command

```
$ NODE_ENV=production npm start
```

Open `localhost:3000` in a browser.
Open `browser debug console`. Now all the public assets are from the cdn server `localhost:3001` with a version hash. 

### Debug

appstackr has no source map. To figure out what's wrong, use the following command to beautify the codes and see where the error is in browser console. Use `stacks.js` as an index, if not sure which source file it is. e.g. to check `example.min.js` 

```
$ npm run appstack -- -bf example:js
```