var React = require('react');
var Popup = require('./popup');

module.exports = React.createClass({
  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.title}</title>
            <link rel="stylesheet" href="/stylesheets/screen.css" />
          </head>
          <body>
            <Popup />
            {this.props.children}
            <script src="/main.js"></script>
          </body>
        </html>
        );
  }
});
