var React = require('react');
var RouteHandler  = require('react-router').RouteHandler ;
var Layout = require('./layout');

module.exports = React.createClass({
  render: function () {
    return (
        <Layout {...this.props}>
          <RouteHandler {...this.props} />
        </Layout>
        );
  }
});
