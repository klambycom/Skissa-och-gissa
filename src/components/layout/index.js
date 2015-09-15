var React = require('react');
var Link = require('react-router').Link;
var Popup = require('../popup');
var SiteInformation = require('./site_information');

module.exports = React.createClass({
  propTypes: {
    inGame: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    css: React.PropTypes.array.isRequired,
    js: React.PropTypes.array.isRequired
  },

  _inGameClass: function (name) { return this.props.inGame ? name : ''; },

  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.title}</title>
            {this.props.css.map(function (path, i) { return <link rel="stylesheet" href={path} key={i} />; })}
          </head>
          <body className={this._inGameClass('game')}>
            <header id="header">
              <div>
                <div id="header-title"><Link to="index">{this.props.title}</Link></div>
                <nav id="header-nav">
                  <ul>
                    <li><Link to="index">Förstasidan</Link></li>
                    <li><a href="#">Logga in med Facebook</a></li>
                  </ul>
                </nav>
              </div>
            </header>

            <SiteInformation show={!this.props.inGame} text={this.props.description} />

            <main id="content" className={this._inGameClass('in-game')}>
              {this.props.children}
            </main>

            <footer id="footer">Webbplatsen är skapad av <a href="http://christiann.se">Christian Nilsson</a> och koden finns på <a href="https://github.com/klambycom/Skissa-och-gissa/">Github</a>.</footer>

            <Popup />

            {this.props.js.map(function (path, i) { return <script src={path} key={i}></script>; })}
          </body>
        </html>
        );
  }
});
