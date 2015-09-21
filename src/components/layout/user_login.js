var React = require('react');
var Reflux = require('reflux');
var Link = require('react-router').Link;
var ProfilePicture = require('../profile_picture');
var Lobby = require('../../browser/lobby');

module.exports = React.createClass({
  displayName: 'UserLogin',

  mixins: [
    Reflux.connectFilter(Lobby.store, 'user', function (data) {
      if (data.event === 'user' && data.type === 'login') { return data.data; }
      return this.state.user;
    }.bind(this))
  ],

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return { user: {}, showMore: false };
  },

  componentDidMount: function () {
    if (typeof this.props.user !== 'undefined') {
      Lobby.user.login(this.props.user);
    }

    document.addEventListener('click', this._showLess);
  },

  handleShowMore: function (e) {
    this.setState({ showMore: !this.state.showMore });
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  },

  _showLess: function (e) {
    this.setState({ showMore: false });
  },

  _signedIn: function () { return !!this.state.user.provider; },

  render: function () {
    if (!this._signedIn()) {
      return (
          <div id="user-login">
            <a href="/login/facebook">Logga in med Facebook</a>
          </div>
          );
    }

    console.log('USER', this.state.user);

    return (
        <div id="user-login" className="facebook">
          <a href="#" onClick={this.handleShowMore}>
            <ProfilePicture user={this.state.user} />
            {this.state.user.firstName}
          </a>

          <div className="more" style={this.state.showMore ? {} : { display: 'none' }}>
            <ul>
              <li><Link to="settings">Inställningar</Link></li>
              <li><a href="/logout">Logga ut</a></li>
            </ul>
          </div>
        </div>
        );
  }
});
