var React = require('react');
var Reflux = require('reflux');
var Lobby = require('../browser/lobby');

module.exports = React.createClass({
  mixins: [
    Reflux.connectFilter(Lobby.store, 'currentMessage', function (data) {
      if (data.event === 'alert') { return data.data; }
      return { closeable: false, title: '', message: '', extra: '' };
    })
  ],

  getInitialState: function () {
    return {
      currentMessage: { closeable: false, title: '', message: '', extra: '' }
    };
  },

  isNotValidMessage: function () {
    return typeof this.state.currentMessage.message === 'undefined'
      || this.state.currentMessage.message === '';
  },

  render: function () {
    if (this.isNotValidMessage()) { return <div></div>; }

    // TODO Change popup content with reflux
    // TODO Make the window able to be closed
    // TODO The class show should be added ms seconds after component is rendered!!!!!1

    var classes = 'show';
    if (!this.state.currentMessage.closeable) { classes = ' not-closeable'; }

    return (
        <div id="popup-wrapper" className={classes}>
          <div id="popup" style={{ marginTop: 261 + 'px' }}>
            <div className="title">{this.state.currentMessage.title}</div>
            <div className="message">{this.state.currentMessage.message}</div>
            <div className="extra">{this.state.currentMessage.extra}</div>
          </div>
        </div>
        );
  }
});
