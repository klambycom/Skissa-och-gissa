var React = require('react');

module.exports = React.createClass({
  render: function () {
    return (
        <div id="artboard-wrapper">
          <canvas id="artboard" width="800" height="600"></canvas>
        </div>
        );
  }
});
