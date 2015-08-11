var React = require('react');
var Link = require('react-router').Link;

module.exports = React.createClass({
  getInitialState: function () {
    return { nrOfRoundsLeft: 0, nrOfPlayers: 0 };
  },

  propTypes: {
    game: React.PropTypes.object.isRequired,
  },

  componentWillMount: function () {
    this.setState({
      nrOfRoundsLeft: this.props.game.rounds,
      nrOfPlayers: this.props.game.nrOfPlayers
    });
  },

  render: function () {
    return (
        <article className={'game ' + this.props.game.difficulty}>
          <Link to="game" params={{ uuid: this.props.game.uuid }}>
            <img src="/placeholder.png" alt={this.props.game.name} />
            <h1>{this.props.game.name}</h1>
            <p className="description">{this.props.game.description} <span className="rounds-left">{this.state.nrOfRoundsLeft}</span> runder kvar att spela.</p>
          </Link>

          <p className="players">
            <span className="friends">TODO Friends</span>
            <span className="nr-of-players">{this.state.nrOfPlayers} spelare just nu</span>
          </p>
        </article>
        );
  }
});
