var React = require('react');
var Link = require('react-router').Link;
var ProfilePicture = require('../profile_picture');

module.exports = React.createClass({
  displayName: 'UserLogin',

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return { signedIn: false, showMore: false };
  },

  componentDidMount: function () {
    if (typeof this.props.user !== 'undefined') {
      this.setState({ signedIn: true });
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

  render: function () {
    if (!this.state.signedIn) {
      return (
          <div id="user-login">
            <a href="/login/facebook">Logga in med Facebook</a>
          </div>
          );
    }

    return (
        <div id="user-login" className="facebook">
          <a href="#" onClick={this.handleShowMore}>
            <ProfilePicture user={this.props.user} />
            {this.props.user.facebook.firstName}
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
