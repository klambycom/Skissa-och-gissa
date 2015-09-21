var Reflux = require('reflux');
var socket = require('./websocket');

var createAnonymousUser = function (data) {
  return {
    provider: 'anonymous'
  }
};

var createFacebookUser = function (data) {
  return {
    provider: 'facebook',
    id: data.facebook.id,
    access_token: data.facebook.access_token,
    name: `${data.facebook.firstName} ${data.facebook.lastName}`,
    firstName: data.facebook.firstName,
    friends: data.facebook.friends,
    permissions: data.facebook.permissions
  };
};

var createUser = function (data) {
  if (typeof data.facebook !== 'undefined') {
    return createFacebookUser(data);
  }

  return createAnonymousUser(data);
};

var actions = Reflux.createActions({
    flash: {}, // Flash-messages
    alert: {}, // PopUp-dialog
    user: { children: [ 'login', 'logout' ] }
});

var store = Reflux.createStore({
  listenables: actions,

  init() {
    this.user = createUser({});
    socket.on('invalid room', this.invalidRoom);
  },

  invalidRoom(data) {
    // TODO Check if room is full or not found.
    // TODO Join room again when connecting after disconnect
    if (typeof data === 'undefined') {
      console.log('Game 404');
    } else {
      console.log('Game probebly full');
    }
  },

  onFlash(message) {
    this.trigger({ event: 'flash', type: '', data: message });
  },

  onAlert(message, title = 'Hej!', extra = '', closeable = true) {
    this.trigger({
      event: 'alert',
      type: '',
      data: { message, title, extra, closeable }
    });
  },

  /*!
   * USER
   */

  _triggerUser: function (type, data) {
    this.trigger({ event: 'user', type, data });
  },

  onUserLogin: function (user) {
    this.user = createUser(user);
    this._triggerUser('login', this.user);
  },

  onUserLogout: function () {
  }
});

module.exports = actions;
module.exports.store = store;
