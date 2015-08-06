var React = require('react');
var Login = require('./login');
var Highscore = require('./highscore');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function () {
    return (
        <div>
          <header onClick={this.onButtonClick}>
            <Link to="index">
              <h1>{this.props.title}</h1>
            </Link>
            <p>{this.props.description}</p>
          </header>
          <main id="main">
            <div id="games">
              Inga settings än!
            </div>
            <aside id="sidebar">
              <Login user={this.props.user} />
              <Highscore title="Highscore" />
            </aside>
          </main>
          <footer id="footer">Webbplatsen är skapad av <a href="http://christiann.se">Christian Nilsson</a> och koden finns på <a href="https://github.com/klambycom/Skissa-och-gissa/">Github</a>.</footer>
        </div>
        );
  }
});
