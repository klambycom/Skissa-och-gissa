var React = require('react');

module.exports = React.createClass({
  displayName: 'ProfilePicture',

  getInitialState() {
    return { url: '/assets/nopic50.png', alt: 'Profilbild' };
  },

  getDefaultProps() {
    return { size: 'small' };
  },

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(['small', 'normal', 'album', 'large', 'square'])
  },

  componentDidMount() {
    // Set src from Facebook
    if (this.props.user && this.props.user.provider === 'facebook') {
      // Doc: https://developers.facebook.com/docs/graph-api/reference/v2.4/user/picture
      this.setState({
        url: `http://graph.facebook.com/v2.4/${this.props.user.id}/picture?type=${this.props.size}`,
        alt: `Bild på ${this.props.user.name}`
      });
    }
  },

  render() {
    return <img
      src={this.state.url}
      alt={this.state.alt}
      id="profile-picture"
      className={this.props.size} />;
  }
});
