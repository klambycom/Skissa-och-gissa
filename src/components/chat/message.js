var React = require('react');

module.exports = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired,
    message: React.PropTypes.string.isRequired,
    isMe: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return { isMe: false }
  },

  render: function () {
    var classes = 'message';
    if (this.props.isMe) { classes += ' me'; }

    return (
        <div className={classes}>
          {this.props.message}
        </div>
        );
  }
});
