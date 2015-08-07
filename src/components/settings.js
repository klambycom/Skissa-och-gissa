var React = require('react');
var PageLayout = require('./page_layout');

module.exports = React.createClass({
  render: function () {
    return (
        <PageLayout {...this.props}>
          Inga settings än!
        </PageLayout>
        );
  }
});
