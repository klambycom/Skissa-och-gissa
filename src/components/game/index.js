var React = require('react');
var Chat = require('./chat');

module.exports = React.createClass({
  componentDidMount: function () {
    console.log(this.props.title);
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
