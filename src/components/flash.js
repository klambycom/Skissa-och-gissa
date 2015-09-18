var React = require('react');
var Reflux = require('reflux');
var Lobby = require('../browser/lobby');

module.exports = React.createClass({
  displayName: 'Flash',

  mixins: [
    Reflux.connectFilter(Lobby.store, 'currentMessage', function (data) {
      if (data.event === 'flash') { return data; }
      return { currentMessage: { type: '', data: '' } };
    })
  ],

  propTypes: {
    messages: React.PropTypes.array
  },

  getDefaultProps: function () {
    return { messages: [] };
  },

  getInitialState: function () {
    return { currentMessage: { type: '', data: '' } };
  },

  componentWillMount: function () {
    if (this.props.messages.length > 0) {
      this.setState({
        currentMessage: {
          data: this.props.messages.reduce(function (acc, x) {
            return acc + ' ' + x;
          })
        }
      });
    }
  },

  handleClose: function (e) {
    this.setState({ currentMessage: { type: '', data: '' } });
    e.preventDefault();
  },

  isNotValidMessage: function () {
    return typeof this.state.currentMessage.data === 'undefined'
      || this.state.currentMessage.data === '';
  },

  render: function () {
    if (this.isNotValidMessage()) { return <div></div>; }

    return (
        <div id="flash-message">
          <div className="message">{this.state.currentMessage.data}</div>
          <a href="#" className="fa fa-times" onClick={this.handleClose}></a>
        </div>
        );
  }
});
