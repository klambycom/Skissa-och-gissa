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
        <div id="login"><a href="/login/facebook">Logga in med Facebook</a></div>
        );
  }
});
