var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.title}</title>
          </head>
          <body>
            <div id="page">
              {this.props.children}
            </div>
          </body>
        </html>
        );
  }
});
