var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/app');
var Index = require('./components/pages/index');
var Game = require('./components/game/index');
var Settings = require('./components/pages/settings');

var routes = module.exports = (
    <Route path='/' handler={App}>
      <DefaultRoute name='index' handler={Index} />
      <Route name="game" path="/game" handler={Game} />
      <Route name="settings" path="/settings" handler={Settings} />
    </Route>
    );
