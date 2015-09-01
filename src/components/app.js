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
            <link rel="stylesheet" href={this.props.css_path} />
            <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
          </head>
          <body className="game">
            <Popup />
            <RouteHandler {...this.props} />
            <script src={this.props.js_path}></script>
          </body>
        </html>
        );
  }
});
