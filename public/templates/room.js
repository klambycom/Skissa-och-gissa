(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['room.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div id=\"game-user-info\">\n  <h1>En kategori</h1>\n  <div class=\"players\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img class=\"you\" src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <img src=\"http://lorempixel.com/50/50\">\n  </div>\n</div>\n<div class=\"line\"></div>\n\n<div id=\"chat\">\n  <div id=\"chat-messages\"></div>\n  <div id=\"chat-input\">\n    <img src=\"http://lorempixel.com/50/50\">\n    <input type=\"text\" placeholder=\"Gissa på ett ord..\">\n  </div>\n</div>\n\n<div id=\"gameplan\">\n  <canvas id=\"artboard\" width=\"800\" height=\"600\"></canvas>\n</div>\n";
  });
})();