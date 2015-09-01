var React = require('react');

module.exports = React.createClass({
  onSelectGame: function () {
    alert('Seleted the game');
  },

  render: function () {
    return (
        <article className="game hard">
          <a href="#" onClick={this.onSelectGame}>
            <img src="assets/{this.props.image}" alt={this.props.image} />
          </a>
          <a href="#" onClick={this.onSelectGame}>
            <h1>{this.props.name}</h1>
          </a>
          <p className="description">
            {this.props.description} Just nu <span className="nr-of-players">{this.props.nrOfPlayers}</span> spelare med <span className="rounds-left">{this.props.roundsLeft}</span> rundor kvar att spela.
          </p>
          <div className="players">TODO</div>
        </article>
        );
  }
});
