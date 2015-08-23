var React = require('react');
var Reflux = require('reflux');
var State = require('react-router').State;
var Cryons = require('./cryons');
var Logic = require('../../browser/logic');

module.exports = React.createClass({
  mixins: [Reflux.listenTo(Logic.store, 'handleMessage'), State],

  getInitialState: function () {
    return { messages: [] };
  },

  componentWillMount: function () {
    Logic.actions.join(this.getParams().uuid);
  },

  handleMessage: function (data) {
    var message, player = 'server';

    // Connection status changed
    if (data.event === 'connection') {
      if (data.type === 'connected') {
        message = 'Du har gått med i spelet';
      } else {
        message = 'Du har lämnat spelet';
      }
    }
    // Chat messages
    else if (data.event === 'chat' ) {
      if (data.type === 'new-player') {
        message = 'En ny spelare har gått med i spelet TODO';
      } else if (data.type === 'message') {
        player = data.data.player;
        message = data.data.message;
      }
    }
    // Player updates
    else if (data.event === 'player' && data.type === 'update') {
      console.log(data.data);
    }

    // Print out message
    if (typeof message !== 'undefined') {
      this.setState({
        messages: this.state.messages.concat([{ from: player, message: message }])
      });
    }
  },

  handleChatInput: function (event) {
    if (event.which === 13) {
      Logic.actions.chat(event.target.value);
      event.target.value = '';
    }
  },

  render: function () {
    // Server and player messages
    var messages = this.state.messages.map(function (data, i) {
      if (data.from === 'server') {
        return (<div className="message server" key={i}>{data.message}</div>);
      }

      return (<div className="message" key={i}>{data.message}</div>);
    });

    return (
        <div id="chat-container">
          <div id="game-user-info">
            <div className="players">TODO</div>
          </div>

          <div id="chat">
            <div id="chat-messages">{messages}</div>
            <div id="chat-input">
              <img src="/placeholder.png" alt="TODO" />
              <input
                type="text"
                placeholder="Gissa på ett ord.."
                onKeyPress={this.handleChatInput}
                autofocus />
            </div>
          </div>

          <Cryons />
        </div>
        );
  }
});
