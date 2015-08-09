var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return { url: '/nopic50.png' };
  },

  getDefaultProps: function () {
    return { size: 'small' };
  },

  propTypes: {
    user: React.PropTypes.object.isRequired,
    size: React.PropTypes.oneOf(['small', 'normal', 'album', 'large', 'square'])
  },

  componentWillMount: function () {
    if (this.props.user.facebook && this.props.user.facebook.id) {
      // Doc: https://developers.facebook.com/docs/graph-api/reference/v2.4/user/picture
      this.setState({
        url: 'http://graph.facebook.com/v2.4/' + this.props.user.facebook.id
          + '/picture?type=' + this.props.size
      });
    }
  },

  render: function () {
    return <img
      src={this.state.url}
      alt="Profilbild"
      id="profile-picture"
      className={this.props.size} />;
  }
});
