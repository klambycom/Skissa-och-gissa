var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return { render: false, closeable: false, title: '', message: '', extra: '' };
  },

  render: function () {
    if (!this.state.render) { return <div></div>; }

    // TODO Change popup content with reflux
    // TODO The class show should be added ms seconds after component is rendered!!!!!1

    return (
        <div id="popup-wrapper" className="not-closeable show">
          <div id="popup" style={{ marginTop: 261 + 'px' }}>
            <div className="title">{this.state.title}</div>
            <div className="message">{this.state.message}</div>
            <div className="extra">{this.state.extra}</div>
          </div>
        </div>
        );
  }
});
