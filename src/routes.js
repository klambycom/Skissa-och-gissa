var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var App = require('./components/app');
var Index = require('./components/frontpage/index');
var Game = require('./components/game/index');
var Settings = require('./components/settings');
var Admin = require('./components/admin/index');
var Logs = require('./components/admin/logs');

var routes = module.exports = (
    <Route path='/' handler={App}>
      <DefaultRoute name='index' handler={Index} />
      <Route name="game" path="/game/:uuid" handler={Game} />
      <Route name="settings" path="/settings" handler={Settings} />
      <Route name="admin" path="/admin" handler={Admin} />
      <Route name="logs" path="/admin/logs" handler={Logs} />
    </Route>
    );
