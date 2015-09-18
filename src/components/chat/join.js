var React = require('react');

module.exports = React.createClass({
  displayName: 'Join',

  propTypes: {
    room: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
        <div className='message join'>
          Du har gått med i spelet "{this.props.room.name}" som just nu har {this.props.room.rounds} runder kvar med {this.props.room.nrOfPlayers} aktiva spelare.
        </div>
        );
  }
});
