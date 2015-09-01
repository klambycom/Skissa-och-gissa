var React = require('react');
var Layout = require('../pages/layout');

module.exports = React.createClass({

  render: function () {
    return (
        <Layout {...this.props}>
          <h2>/admin</h2>
        </Layout>
        );
  }
});
