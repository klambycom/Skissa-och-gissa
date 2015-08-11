var React = require('react');
var State = require('react-router').State;
var Chat = require('./chat');
var api = require('../../browser/api');

module.exports = React.createClass({
  mixins: [ State ],

  getInitialState: function () {
    return {
      name: '',
      maxPlayers: 0,
      nrOfPlayers: 0,
      nrOfRoundsLeft: 0,
      time: 0,
      players: []
    };
  },

  componentWillMount: function () {
    if (this.props.game) {
      this._setGame(this.props.game);
    } else {
      api.games.get(this.props.params.uuid).then(function (response) {
        this._setGame(response.body().data());
      }.bind(this));
    }
  },

  _setGame: function (game) {
    this.setState({
      name: game.name,
      maxPlayers: game.maxPlayers,
      nrOfPlayers: game.nrOfPlayers,
      nrOfRoundsLeft: game.rounds,
      time: game.time,
      players: game.players
    });
  },

  render: function () {
    return (
        <div id="game-wrapper">
          <Chat />

          <div id="gameplan">
            <div id="timer">
              <div id="timer-progress"></div>
            </div>
            <div id="artboard-wrapper">
              <canvas id="artboard" width="800" height="600"></canvas>
            </div>
          </div>
        </div>
        );
  }
});
