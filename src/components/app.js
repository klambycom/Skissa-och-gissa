var React = require('react');
var RouteHandler  = require('react-router').RouteHandler ;
var Layout = require('./layout');
var Flash = require('./flash');

module.exports = React.createClass({
  render: function () {
    return (
        <Layout {...this.props}>
          <Flash messages={this.props.message} />
          <RouteHandler {...this.props} />
        </Layout>
        );
  }
});
