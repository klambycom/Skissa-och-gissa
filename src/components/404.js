var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.title}</title>
          </head>
          <body style={{ width: 300 + 'px', margin: '0 auto'}}>
            <h1>{this.props.title}</h1>
            <p>Det finns ingen sida med addressen <b>{this.props.url}</b>. Kontrollera addressen igen eller gå till <a href="/">skissaochgissa.se</a>.</p>
          </body>
        </html>
        );
  }
});
