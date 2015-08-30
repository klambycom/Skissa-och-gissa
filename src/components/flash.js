var React = require('react');

module.exports = React.createClass({
  propTypes: {
    messages: React.PropTypes.array
  },

  getDefaultProps: function () {
    return { messages: [] };
  },

  getInitialState: function () {
    return { message: '' };
  },

  componentWillMount: function () {
    if (this.props.messages.length > 0) {
      this.setState({ message: this.props.messages[0] });
    }
  },

  handleClose: function (e) {
    this.setState({ message: '' });
    e.preventDefault();
  },

  render: function () {
    if (this.state.message === '') { return <div></div>; }

    return (
        <div id="flash-message">
          <div className="message">{this.state.message}</div>
          <a href="#" className="fa fa-times" onClick={this.handleClose}></a>
        </div>
        );
  }
});
