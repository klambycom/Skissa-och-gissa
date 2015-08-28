var React = require('react');
var Reflux = require('reflux');
var State = require('react-router').State;
var Logic = require('../../browser/logic');

// Components
var Cryons = require('../game/cryons');
var ProfilePicture = require('../profile_picture');

// Message types
var Message = require('./message');
var Server = require('./server');
var Join = require('./join');

module.exports = React.createClass({
  mixins: [Reflux.listenTo(Logic.store, 'handleMessage'), State],

  getInitialState: function () {
    return { messages: [], game: {}, hasJoined: false };
  },

  componentWillMount: function () {
    Logic.actions.join(this.getParams().uuid);
  },

  _shouldCreateMessage: function (data) {
    return data.event === 'chat'
      || (data.event === 'connection' && this.state.hasJoined)
      || (data.event === 'join' && data.type === 'game')
      || (data.event === 'otherPlayer' && data.type === 'joined');
    //this.trigger({ event: 'otherPlayer', type: 'joined', data: data });
  },

  _messageTypes: {
    chat: function (key, type, data) {
      return <Message player={data.player} message={data.message} isMe={data.me} key={key} />
    },

    otherPlayer: function (key, type, data) {
      return <Server type={type} data={data} key={key} />
    },

    connection: function (key, type) {
      return <Server type={type} key={key} />
    },

    join: function (key, type, data) {
      return <Join room={data} key={key} />
    }
  },

  _checkIfAlone: function (n) {
    if (n === 1) {
      var messages = this.state.messages.concat(
          [{ event: 'connection', type: 'alone' }]);

      this.setState({ messages: messages });
    }
  },

  handleMessage: function (data) {
    // Create a message if the event should create a message
    if (this._shouldCreateMessage(data)) {
      this.setState({ messages: this.state.messages.concat([data]) });
    }

    // Player updates
    if (data.event === 'player' && data.type === 'update') {
      this.setState({ player: data.data });
    }
    // The player joins the room
    else if (data.event === 'join' && data.type === 'game') {
      this.setState({
        hasJoined: true,
        game: data.data,
        player: Logic.store.player
      });
      // Show message if the player is the only player
      this._checkIfAlone(data.data.nrOfPlayers);
    }
  },

  handleChatInput: function (event) {
    if (event.which === 13) {
      Logic.actions.chat(event.target.value);
      event.target.value = '';
    }
  },

  render: function () {
    return (
        <div id="chat-container">
          <div id="game-user-info">
            <div className="players">TODO</div>
          </div>

          <div id="chat">
            <div id="chat-messages">{this.state.messages.map(function (data, i) {
              return this._messageTypes[data.event](i, data.type, data.data);
            }.bind(this))}</div>

            <div id="chat-input">
              <ProfilePicture user={this.props.player} size="small" />
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