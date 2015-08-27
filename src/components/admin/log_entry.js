var React = require('react');
var moment = require('moment');
require('moment/locale/sv');

module.exports = React.createClass({

  getInitialState: function () {
    return { showMore: false };
  },

  getDefaultProp: function () {
    return { message: '', level: '', timestamp: '', meta: '' };
  },

  handleToggleMore: function (e) {
    this.setState({ showMore: !this.state.showMore });
    e.preventDefault();
  },

  render: function () {
    var timestamp = moment(this.props.timestamp).format('dddd, D MMMM YYYY HH:mm:ss');

    // TODO Change to ES6 and React.addons.classSet()! [this.props.level]: true
    var classNames = this.props.level;
    if (this.state.showMore) {
      classNames += ' show-more';
    }

    return (
        <div className={classNames}>
          <a href="#" className="message" onClick={this.handleToggleMore}>{this.props.message}</a>
          <pre>{JSON.stringify(this.props.meta, null, 2)}</pre>
          <div className="meta">
            <span className="timestamp">{timestamp}</span>
          </div>
        </div>
        );
  }
});
