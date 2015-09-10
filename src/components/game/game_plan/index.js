var React = require('react');
var DrawingArea = require('./drawing_area');

module.exports = React.createClass({
  // TODO chat.offsetWidth or gameplan.offsetLeft (+5 border size of
  // drawingarea)
  render: function () {
    return (
        <div id="gameplan">
          <div id="timer">
            <div id="timer-progress"></div>
          </div>
          <DrawingArea offsetX={335} offsetY={5} />
        </div>
        );
  }
});
