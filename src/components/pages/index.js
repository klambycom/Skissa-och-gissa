var React = require('react');
var Layout = require('./layout');

module.exports = React.createClass({
  getInitialState: function () {
    return { games: [] };
  },

  render: function () {
    // Dispaly loading text
    var loading = '';
    if (this.state.games.length === 0) {
      loading = (
          <div id="games">
            <div id="load-games"><img src="/ajax-loader.gif" />Hämtar spel...</div>
          </div>
          );
    }

    return (
        <Layout {...this.props}>
          {loading}
          TODO
        </Layout>
        );
  }
});
