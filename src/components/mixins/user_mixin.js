var React = require('react');
var Reflux = require('reflux');
var Lobby = require('../../browser/lobby');

module.exports = {
  propTypes: {
    user: React.PropTypes.object
  },

  componentDidMount() {
    // Subscribe to store
    this.unsubscribe = Lobby.store.listen(this.onUserChange);

    // Set user
    if (typeof this.props.user !== 'undefined') {
      Lobby.user.login(this.props.user);
    }
  },

  componentWillUnmount() {
    this.unsubscribe();
  },

  onUserChange(data) {
    if (data.event === 'user' && data.type === 'login') {
      this.user = data.data;
      this.forceUpdate();
    }
  },

  isSignedIn() { return !!this.user; }
};
