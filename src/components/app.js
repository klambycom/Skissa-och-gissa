var React = require('react');
var RouteHandler  = require('react-router').RouteHandler ;
var Popup = require('./popup');

module.exports = React.createClass({
  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.page_title}</title>
            <link rel="stylesheet" href="/stylesheets/screen.css" />
          </head>
          <body>
            <Popup />
            <RouteHandler {...this.props} />
            <script src="/main.js"></script>
          </body>
        </html>
        );
  }
});
