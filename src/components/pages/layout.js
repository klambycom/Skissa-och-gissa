var React = require('react');
var Link = require('react-router').Link;
var Highscore = require('./sidebar/highscore');
var Flash = require('../flash');

module.exports = React.createClass({
  render: function () {
    // TODO Rename #games to something better!
    return (
        <div>
          <header>
            <Link to="index"><h1>{this.props.page_title}</h1></Link>
            <p>{this.props.page_description}</p>
          </header>
          <main id="main">
            <div id="games">
              <Flash messages={this.props.message} />
              {this.props.children}
            </div>
            <aside id="sidebar">
              <Highscore title="Highscore" />
            </aside>
          </main>
          <footer id="footer">Webbplatsen är skapad av <a href="http://christiann.se">Christian Nilsson</a> och koden finns på <a href="https://github.com/klambycom/Skissa-och-gissa/">Github</a>.</footer>
        </div>
        );
  }
});
