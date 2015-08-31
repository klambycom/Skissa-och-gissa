var Reflux = require('reflux');

var actions = Reflux.createActions([
    'flash', // Flash-messages
    'alert' // PopUp-dialog
]);

var store = Reflux.createStore({
  listenables: actions,

  onFlash: function (message) {
    this.trigger({ event: 'flash', type: '', data: message });
  },

  onAlert: function (message, title, extra, closeable) {
    if (typeof title === 'undefined' || title === null) { title = 'Hej!'; }
    if (typeof extra === 'undefined' || extra === null) { extra = ''; }
    if (typeof closeable === 'undefined' || closeable === null) { closeable = true; }

    this.trigger({
      event: 'alert',
      type: '',
      data: {
        message: message,
        title: title,
        extra: extra,
        closeable: closeable
      }
    });
  }
});

global._alert = function (message, title, extra) {
  actions.alert(message, title, extra);
};

module.exports = actions;
module.exports.store = store;
