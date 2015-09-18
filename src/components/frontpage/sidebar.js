var React = require('react');

module.exports = React.createClass({
  displayName: 'Sidebar',

  render: function () {
    return (
        <div>
          <aside id="toplist">
            <h2>Topplista</h2>
          </aside>

          <aside id="toplist-friends">
            <h2>Vänner</h2>
          </aside>
        </div>
        );
  }
});
