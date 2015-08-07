var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/app');
var Index = require('./components/index');
var Room = require('./components/room');
var Settings = require('./components/settings');

var routes = module.exports = (
    <Route path='/' handler={App}>
      <DefaultRoute name='index' handler={Index} />
      <Route name="game" path="/game" handler={Room} />
      <Route name="settings" path="/settings" handler={Settings} />
    </Route>
    );
