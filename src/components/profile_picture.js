var React = require('react');

module.exports = React.createClass({
  displayName: 'ProfilePicture',

  getInitialState: function () {
    return { url: '/assets/nopic50.png', alt: 'Profilbild' };
  },

  getDefaultProps: function () {
    return { size: 'small', user: {} };
  },

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(['small', 'normal', 'album', 'large', 'square'])
  },

  componentWillMount: function () {
    // Set src from Facebook
    if (this.props.user.facebook && this.props.user.facebook.id) {
      // Doc: https://developers.facebook.com/docs/graph-api/reference/v2.4/user/picture
      this.setState({
        url: 'http://graph.facebook.com/v2.4/' + this.props.user.facebook.id
          + '/picture?type=' + this.props.size
      });
    }

    // Set alt from Facebook
    if (this.props.user.facebook && this.props.user.facebook.firstName) {
      this.setState({
        alt: 'Bild på ' + this.props.user.facebook.firstName
          + ' ' + this.props.user.facebook.lastName
      });
    }

    // TODO Set src from Twitter

    // TODO Set alt from Twitter
  },

  render: function () {
    return <img
      src={this.state.url}
      alt={this.state.alt}
      id="profile-picture"
      className={this.props.size} />;
  }
});
