var React = require('react');
var Link = require('react-router').Link;
var Popup = require('../popup');
var SiteInformation = require('./site_information');

module.exports = React.createClass({
  _inGameClass: function () { return this.props.inGame ? 'in-game' : ''; },

  render: function () {
    // TODO <body className="game"> .game should be added later for effect! But
    // should maybe remove later.
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.page_title}</title>
            <link rel="stylesheet" href={this.props.css_path} />
            <link rel="stylesheet" href={this.props.fontAwesome_path}/>
          </head>
          <body className="game">
            <header id="header">
              <div>
                <div id="header-title"><Link to="index">{this.props.page_title}</Link></div>
                <nav id="header-nav">
                  <ul>
                    <li><a href="#">Förstasidan</a></li>
                    <li><a href="#">Logga in med Facebook</a></li>
                  </ul>
                </nav>
              </div>
            </header>

            <SiteInformation show={!this.props.inGame} text={this.props.page_description} />

            <main id="content" className={this._inGameClass()}>
              {this.props.children}
            </main>

            <footer id="footer">Webbplatsen är skapad av <a href="http://christiann.se">Christian Nilsson</a> och koden finns på <a href="https://github.com/klambycom/Skissa-och-gissa/">Github</a>.</footer>

            <Popup />
            <script src={this.props.js_path}></script>
          </body>
        </html>
        );
  }
});
