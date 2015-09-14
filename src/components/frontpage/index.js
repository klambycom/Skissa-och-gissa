var React = require('react');
var GameListItem = require('./game');
var Sidebar = require('./sidebar');

module.exports = React.createClass({
  getInitialState: function () {
    return { games: [] };
  },

  componentWillMount: function () {
    // Games from when rendering from server
    if (this.props.games) { this.setState({ games: this.props.games }); }
  },

  renderLoadingGames: function () {
    // Dispaly loading text
    var loading = '';
    if (this.state.games.length === 0) {
      loading = (
          <div id="games">
            <div id="load-games"><img src="/ajax-loader.gif" />Hämtar spel...</div>
          </div>
          );
    }

    return loading;
  },

  render: function () {
    return (
        <div id="frontpage">
          <div>
            <h2>Aktiva spel</h2>

            {this.renderLoadingGames()}

            <section id="game-list">
              {this.state.games.map(function (game, i) {
                return <GameListItem game={game} key={i} />;
              })}
            </section>
          </div>

          <Sidebar />
        </div>
        );
  }
});
