var React = require('react');
var Layout = require('../pages/layout');
var api = require('../../browser/api');
var LogEntry = require('./log_entry.js');

module.exports = React.createClass({

  getInitialState: function () {
    return {
      amount: { total: 0, debug: 0, verbose: 0, info: 0, warn: 0, error: 0 },
      entries: []
    };
  },

  componentDidMount: function () {
    api.logs
      .getAll(this.props.params.uuid)
      .then(this._updateEntries)
      .catch(function (error) { console.log('Logs error:', error); });
  },

  _updateEntries: function (entries) {
    var data = entries.body().data();
    this.setState({ amount: data.nrOfEntries, entries: data.entries });
  },

  handleSelectLevel: function (type) {
    return function (e) {
      console.log(type + ' selected');
      e.preventDefault();
    }.bind(this);
  },

  render: function () {

    return (
        <Layout {...this.props}>
          <h1>Loggar</h1>

          <div id="log-levels">
            <a href="#" className="total" onClick={this.handleSelectLevel('total')}>
              Total <span className="amount">{this.state.amount.total}</span></a>
            <a href="#" className="debug" onClick={this.handleSelectLevel('debug')}>
              Debug <span className="amount">{this.state.amount.debug}</span></a>
            <a href="#" className="verbose" onClick={this.handleSelectLevel('verbose')}>
              Verbose <span className="amount">{this.state.amount.verbose}</span></a>
            <a href="#" className="info" onClick={this.handleSelectLevel('info')}>
              Info <span className="amount">{this.state.amount.info}</span></a>
            <a href="#" className="warn" onClick={this.handleSelectLevel('warn')}>
              Warn <span className="amount">{this.state.amount.warn}</span></a>
            <a href="#" className="error" onClick={this.handleSelectLevel('error')}>
              Error <span className="amount">{this.state.amount.error}</span></a>
          </div>

          <div id="log-entries">{this.state.entries.slice(0, 20).map(function (x, i) {
            return (
                <LogEntry
                  message={x.message}
                  level={x.level}
                  timestamp={x.timestamp}
                  meta={x.meta}
                  key={i} />
                );
          })}</div>
        </Layout>
        );
  }
});
