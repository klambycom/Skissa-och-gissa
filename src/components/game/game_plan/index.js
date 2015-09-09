var React = require('react');
var DrawingArea = require('./drawing_area');

module.exports = React.createClass({
  render: function () {
    return (
        <div id="gameplan">
          <div id="timer">
            <div id="timer-progress"></div>
          </div>
          <DrawingArea />
        </div>
        );
  }
});
