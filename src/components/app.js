var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var State = require('react-router').State;
var Layout = require('./layout');
var Flash = require('./flash');

module.exports = React.createClass({
  mixins: [ State ],

  _testPath: function () {
    return /\/game\//.test(this.context.router.getCurrentPathname());
  },

  render: function () {
    return (
        <Layout {...this.props} inGame={this._testPath()}>
          <Flash messages={this.props.message} />
          <RouteHandler {...this.props} />
        </Layout>
        );
  }
});
