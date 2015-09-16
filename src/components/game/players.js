var React = require('react');
var Reflux = require('reflux');
var Logic = require('../../browser/logic');
var ProfilePicture = require('../profile_picture');

module.exports = React.createClass({
  displayName: 'Players',

  mixins: [Reflux.listenTo(Logic.store, 'handlePlayers')],

  getInitialState: function () {
    return { players: [] };
  },

  _addPlayer: function (player) {
    return this.state.players.concat([player]);
  },

  _removePlayer: function (player) {
    return this.state.players.filter(function (x) {
      return x.UUID !== player.UUID;
    });
  },

  handlePlayers: function (data) {
    // Other player joins the game
    if (data.event === 'otherPlayer' && data.type === 'joined') {
      this.setState({ players: this._addPlayer(data.data) });
    }
    // Other player leaves the game
    else if (data.event === 'otherPlayer' && data.type === 'left') {
      this.setState({ players: this._removePlayer(data.data) });
    }
    // Init players
    else if (data.event === 'join' && data.type === 'game') {
      this.setState({ players: data.data.players });
    }
  },

  _classesFor: function (player) {
    var classes = 'player';
    if (Logic.store.player.UUID === player.UUID) { classes += ' you'; }
    return classes;
  },

  render: function () {
    return (
        <div id="game-user-info">
          <div className="players">
            {this.state.players.map(function (x, i) {
              return (
                  <div className={this._classesFor(x)} key={i}>
                    <ProfilePicture user={x} size="small" />
                    <div className="information">
                      <span className="name">{x.name}</span>
                      <span className="points">{x.points} poäng</span>
                    </div>
                  </div>
                  );
            }.bind(this))}
          </div>
        </div>
        );
  }
});
