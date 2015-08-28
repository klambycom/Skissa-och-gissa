var React = require('react');
var ProfilePicture = require('../../profile_picture');

module.exports = React.createClass({
  getInitialState: function () {
    return { signedIn: false };
  },

  componentWillMount: function () {
    if (typeof this.props.user !== 'undefined') {
      this.setState({ signedIn: true });
    }
  },

  render: function () {
    if (this.state.signedIn) {
      return (
          <div id="login" className="facebook">
            <ProfilePicture user={this.props.user} />
            Inloggad som {this.props.user.facebook.firstName} {this.props.user.facebook.lastName}
            {' '}
            <a href="/logout">Logga ut</a>
          </div>
          );
    }

    return (
        <div id="login">
          <h2><a href="/login/facebook">Logga in med Facebook</a></h2>
          <ul className="small-text">
            <li>Dina poäng kommer sparas.</li>
            <li>Du har möjlighet att komma med i topplistan.</li>
            <li>Du kan se i vilka spel dina vänner spelar.</li>
            <li>Du och dina vänner får en egen topplista.</li>
          </ul>

          <h3>Eller spela utan att logga in</h3>
          <p className="small-text">Välj ett namn som du vill använda när du spelar.</p>
          <p><input type="text" placeholder="Ett namn här..." /></p>
        </div>
        );
  }
});
