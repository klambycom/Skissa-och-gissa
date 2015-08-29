var React = require('react');

module.exports = React.createClass({
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
    'brow'
  ],

  handleClick: function (e) {
    // Select crayon size
    if (e.target.dataset.size) {
      console.log('SIZE', e.target.dataset.size);
    }
    // Select crayon color
    else if (e.target.dataset.color) {
      console.log('COLOR', e.target.dataset.color);
    }

    e.preventDefault();
  },

  renderSize: function (size, i) {
    var classes = 'size-' + size;

    return (
        <li className={classes} key={i}>
          <a href="#" data-size={size} onClick={this.handleClick}></a>
        </li>
        );
  },

  renderColor: function (color, i) {
    return (
        <li className={color} key={i}>
          <a href="#" data-color={color} onClick={this.handleClick}></a>
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
