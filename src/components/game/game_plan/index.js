var React = require('react');
var DrawingArea = require('./drawing_area');

module.exports = React.createClass({
  displayName: 'GamePlan',

  getInitialState: function () {
    return { offset: { x: 0, y: 0 } };
  },

  componentDidMount: function () { this._updateOffset(); },

  _updateOffset: function () {
    this.setState({
      offset: {
        x: this.refs.gameplan.getDOMNode().offsetLeft + 5, // +5 border size
        y: -this.refs.gameplan.getDOMNode().scrollTop // scroll position
          + this.refs.gameplan.getDOMNode().offsetParent.offsetTop + 5 // +header height +5 border size
      }
    });
  },

  handleScroll: function () { this._updateOffset(); },

  render: function () {
    return (
        <div id="gameplan" ref="gameplan" onScroll={this.handleScroll}>
          <div id="timer">
            <div id="timer-progress"></div>
          </div>
          <DrawingArea offsetX={this.state.offset.x} offsetY={this.state.offset.y} />
        </div>
        );
  }
});
