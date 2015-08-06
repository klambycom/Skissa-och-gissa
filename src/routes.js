var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./react/app');
var Index = require('./react/index');
var Room = require('./react/room');
var Settings = require('./react/settings');

var routes = module.exports = (
    <Route path='/' handler={App}>
      <DefaultRoute name='index' handler={Index} />
      <Route name="game" path="/game" handler={Room} />
      <Route name="settings" path="/settings" handler={Settings} />
    </Route>
    );
