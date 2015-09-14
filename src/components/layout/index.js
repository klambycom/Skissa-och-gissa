var React = require('react');
var Link = require('react-router').Link;
var Popup = require('../popup');

module.exports = React.createClass({
  render: function () {
    return (
        <html lang="sv">
          <head>
            <meta charSet="utf-8" />
            <title>{this.props.page_title}</title>
            <link rel="stylesheet" href={this.props.css_path} />
            <link rel="stylesheet" href={this.props.fontAwesome_path}/>
          </head>
          <body>
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

            <aside id="site-information">
              <img src="http://lorempixel.com/400/200" alt="" />
              <div id="site-information-text">
                <h1>Vad är skissa och gissa?</h1>
                <p>Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                <p><span className="bold">Nytt!</span> Sidan har fått ny fräsh layout</p>
              </div>
            </aside>

            <main id="content">
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
