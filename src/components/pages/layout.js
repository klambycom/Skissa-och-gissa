var React = require('react');
var Link = require('react-router').Link;
var Login = require('./sidebar/login');
var Highscore = require('./sidebar/highscore');

module.exports = React.createClass({
  getInitialState: function () {
    return { message: '' };
  },

  componentWillMount: function () {
    if (this.props.message && this.props.message[0]) {
      this.setState({ message: this.props.message[0] });
    }
  },

  render: function () {
    // Display flash messages
    var message = '';
    if (this.state.message !== '') {
      message = <div id="flash-message">{this.state.message}</div>;
    }

    // TODO Rename #games to something better!

    return (
        <div>
          <header>
            <Link to="index"><h1>{this.props.page_title}</h1></Link>
            <p>{this.props.page_description}</p>
          </header>
          <main id="main">
            <div id="games">
              {message}
              {this.props.children}
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
