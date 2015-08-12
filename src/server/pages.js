var pages = require('express').Router();
var passport = require('passport');
var games = require('./games');

pages.get('/', function (req, res) {
  res.render(req.url, {
    title: 'test',
    message: req.flash('message'),
    user: req.user,
    games: games.json()
  });
});

pages.get('/settings', function (req, res) {
  res.render(req.url, {
    title: 'test',
    message: req.flash('message'),
    user: req.user
  });
});

/*
 * Game
 */

pages.param('uuid', function (req, res, next, uuid) {
  req.game = games.get(uuid).toJSON();
  next();
});

pages.get('/game/:uuid', function (req, res) {
  res.render(req.url, { game: req.game });
});

/*
 * User
 */

// TODO

/*
 * Passport
 */

pages.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

pages.get('/login/facebook', passport.authenticate('facebook', {
  scope: 'user_friends'
}));

pages.get('/login/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = pages;
