var React = require('react');
var Chat = require('./chat');

module.exports = React.createClass({

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
      this.setState({
        name: this.props.game.name,
        maxPlayers: this.props.game.maxPlayers,
        nrOfPlayers: this.props.game.nrOfPlayers,
        nrOfRoundsLeft: this.props.game.rounds,
        time: this.props.game.time,
        players: this.props.game.players
      });
    }
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
