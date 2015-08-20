var React = require('react');
var Reflux = require('reflux');
var Cryons = require('./cryons');
var Logic = require('../../browser/logic');

module.exports = React.createClass({
  mixins: [Reflux.listenTo(Logic.store, 'onMessage')],

  getInitialState: function () {
    return { messages: [] };
  },

  onMessage: function (data) {
    // Connection status changed
    if (data.event === 'connection') {
      if (data.type === 'connected') {
        this._message('Du har gått med i spelet');
      } else {
        this._message('Du har lämnat spelet');
      }
    }
    // Chat messages
    else if (data.event === 'chat' ) {
      if (data.type === 'new-player') {
        this._message('En ny spelare har gått med i spelet TODO');
      } else if (data.type === 'message') {
        this._message('TODO', 'TODO');
      }
    }
  },

  _message: function (message, player) {
    if (typeof player === 'undefined') { player = 'server'; }

    this.setState({
      messages: this.state.messages.concat([{ from: player, message: message }])
    });
  },

  _renderMessage: function (data, i) {
    // Server message
    if (data.from === 'server') {
      return (<div className="message server" key={i}>{data.message}</div>);
    }

    // Player message
    return (<div className="message" key={i}>{data.message}</div>);
  },

  render: function () {
    return (
        <div id="chat-container">
          <div id="game-user-info">
            <div className="players">TODO</div>
          </div>

          <div id="chat">
            <div id="chat-messages">{this.state.messages.map(this._renderMessage)}</div>
            <div id="chat-input">
              <img src="/placeholder.png" alt="TODO" />
              <input type="text" placeholder="Gissa på ett ord.." autofocus />
            </div>
          </div>

          <Cryons />
        </div>
        );
  }
});
