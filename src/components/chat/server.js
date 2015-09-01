var React = require('react');

module.exports = React.createClass({
  propTypes: {
    type: React.PropTypes.string.isRequired,
    data: React.PropTypes.object
  },

  getDefaultProps: function () {
    return { data: {} }
  },

  _message: function () {
    if (this.props.type === 'joined') {
      return this.props.data.name + ' har gått med i spelet.';
    }
    else if (this.props.type === 'connected') {
      return 'Du har gått med i spelet.';
    }
    else if (this.props.type === 'disconnected') {
      return 'Du har lämnat spelet.';
    }
    else if (this.props.type === 'alone') {
      return 'Du är just nu ensam i detta spelet. Vänta en stund så kommer det förhoppningsvis fler spelare.';
    }
  },

  render: function () {
    return <div className='server-message'># {this._message()}</div>;
  }
});
