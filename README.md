# Skissa och gissa [![Dependencies badge][david-image]][david-url] [![DevDependencies  badge][david-dev-image]][david-dev-url]

Change FB app id in the file `public/javascript.js`. And socket.io url in the
file `public/browser/game.js`.

Run `grunt`.

Open `localhost:3000`.


## Testing

Run tests and lint the code with `gulp test`, and watch tests with
`gulp watch:test`.


## Environment variables

The application needs some environment variables to run:

* `SESSION_SECRET`
* `COOKIE_SECRET`
* `FACEBOOK_CLIENTID`
* `FACEBOOK_CLIENTSECRET`
* `TWITTER_CONSUMERKEY`
* `TWITTER_CONSUMERSECRET`



[david-url]: https://david-dm.org/klambycom/Skissa-och-gissa#info=dependencies&view=table
[david-image]: https://david-dm.org/klambycom/Skissa-och-gissa.png

[david-dev-url]: https://david-dm.org/klambycom/Skissa-och-gissa#info=devDependencies&view=table
[david-dev-image]: https://david-dm.org/klambycom/Skissa-och-gissa/dev-status.png
