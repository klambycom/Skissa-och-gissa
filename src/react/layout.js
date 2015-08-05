var React = require('react');

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
            {this.props.children}
            <script src="/main.js"></script>
          </body>
        </html>
        );
  }
});
