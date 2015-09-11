var React = require('react');
var DrawingArea = require('./drawing_area');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      offset: { x: 0, y: 0 }
    };
  },

  componentDidMount: function () {
    this.setState({
      offset: {
        x: this.refs.gameplan.getDOMNode().offsetLeft + 5, // +5 border size
        y: 5 // +5 border size
      }
    });
  },

  render: function () {
    return (
        <div id="gameplan" ref="gameplan">
          <div id="timer">
            <div id="timer-progress"></div>
          </div>
          <DrawingArea offsetX={this.state.offset.x} offsetY={this.state.offset.y} />
        </div>
        );
  }
});
