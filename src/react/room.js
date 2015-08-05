var React = require('react');
var Layout = require('./layout');
var Chat = require('./chat');

module.exports = React.createClass({
  render: function () {
    return (
        <Layout title={this.props.title}>
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
        </Layout>
        );
  }
});
