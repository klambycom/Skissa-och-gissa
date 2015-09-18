var React = require('react');
var Logic = require('../../browser/logic');

module.exports = React.createClass({
  displayName: 'Crayons',

  sizes: [5, 10, 15, 20],

  colors: [
    'white',
    'black',
    'red',
    'orange',
    'yellow',
    'yellowgreen',
    'green',
    'lightskyblue',
    'dodgerblue',
    'violet',
    'pink',
    'burlywood',
    'saddlebrown',
    'brown'
  ],

  getInitialState: function () {
    return { color: 'red', size: 5 };
  },

  componentDidMount: function () {
    this.setState({
      color: Logic.store.crayon && Logic.store.crayon.color,
      size: Logic.store.crayon && Logic.store.crayon.size
    });
  },

  handleClick: function (e) {
    var crayon;

    // Select crayon size
    if (e.target.dataset.size) {
      crayon = { size: +e.target.dataset.size };
    }
    // Select crayon color
    else if (e.target.dataset.color) {
      crayon = { color: e.target.dataset.color };
    }

    Logic.actions.canvas.crayon(crayon);
    this.setState(crayon);

    e.preventDefault();
  },

  _selected: function (state, value) { return state === value ? 'selected' : ''; },

  renderSize: function (size, i) {
    var classes = 'size-' + size;
    return (
        <li className={classes} key={i}>
          <a
            href="#"
            data-size={size}
            className={this._selected(this.state.size, size)}
            onClick={this.handleClick}></a>
        </li>
        );
  },

  renderColor: function (color, i) {
    return (
        <li className={color} key={i}>
          <a
            href="#"
            data-color={color}
            className={this._selected(this.state.color, color)}
            onClick={this.handleClick}></a>
        </li>
        );
  },

  render: function () {
    return (
        <div id="crayons">
          <h1>KRITA</h1>
          <ul id="sizes">{this.sizes.map(this.renderSize)}</ul>
          <h1>FÄRG</h1>
          <ul id="colors">{this.colors.map(this.renderColor)}</ul>
        </div>
        );
  }
});
