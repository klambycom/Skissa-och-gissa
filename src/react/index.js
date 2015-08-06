var React = require('react');
var Login = require('./login');
var Highscore = require('./highscore');

module.exports = React.createClass({
  onButtonClick: function () {
    alert('I was rendered on server side but I am clickable because of client mounting!');
  },

  render: function () {
    return (
        <div>
          <header onClick={this.onButtonClick}>
            <h1>{this.props.title}</h1>
            <p>{this.props.description}</p>
          </header>
          <main id="main">
            <div id="games">TODO</div>
            <aside id="sidebar">
              <Login user={this.props.user} />
              <Highscore title="Highscore" />
            </aside>
          </main>
          <footer id="footer">Webbplatsen är skapad av <a href="http://christiann.se">Christian Nilsson</a>.</footer>
        </div>
        );
  }
});
