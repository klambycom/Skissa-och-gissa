var React = require('react');
var State = require('react-router').State;
var api = require('../../browser/api');
var Chat = require('../chat');
var GamePlan = require('./game_plan');

module.exports = React.createClass({
  displayName: 'Game',

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
      api.games
        .get(this.props.params.uuid)
        .then(this._setGame)
        .catch(this._handleError);
    }
  },

  _setGame: function (game) {
    if (typeof game === 'function') { game = game.body().data(); }

    this.setState({
      name: game.name,
      maxPlayers: game.maxPlayers,
      nrOfPlayers: game.nrOfPlayers,
      nrOfRoundsLeft: game.rounds,
      time: game.time,
      players: game.players
    });
  },

  _handleError: function (error) {
    // TODO Handle errors
    if (error && error.status === 404) {
      // TODO Handle game not found! Redirect to / and show error message!
      console.log('Game not found');
    } else {
      console.log('Other error!');
    }
  },

  render: function () {
    return (
        <div id="game-wrapper" className="draw">
          <Chat />
          <GamePlan />
        </div>
        );
  }
});
