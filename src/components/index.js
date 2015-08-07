var React = require('react');
var Login = require('./login');
var Highscore = require('./highscore');

module.exports = React.createClass({
  onButtonClick: function () {
    alert('I was rendered on server side but I am clickable because of client mounting!');
  },

  getInitialState: function () {
    return { message: '', games: [] };
  },

  componentWillMount: function () {
    if (typeof this.props.message[0] !== 'undefined') {
      this.setState({ message: this.props.message[0] });
    }
  },

  render: function () {
    // Display flash messages
    var message = '';
    if (this.state.message !== '') {
      message = <div id="flash-message">{this.state.message}</div>;
    }

    // Dispaly loading text
    var loading = '';
    if (this.state.games.length === 0) {
      loading = (
          <div id="games">
            <div id="load-games"><img src="/ajax-loader.gif" />Hämtar spel...</div>
          </div>
          );
    }

    return (
        <div>
          <header onClick={this.onButtonClick}>
            <h1>{this.props.title}</h1>
            <p>{this.props.description}</p>
          </header>
          <main id="main">
            <div id="games">
              {message}
              {loading}
              TODO
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
