(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['room.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [3,'>= 1.0.0-rc.4'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id=\"chat-container\">\n  <div id=\"game-user-info\">\n    <div class=\"players\">\n    </div>\n  </div>\n\n  <div id=\"chat\">\n    <div id=\"chat-messages\"></div>\n    <div id=\"chat-input\">\n      <img src=\"";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n      <input type=\"text\" placeholder=\"Gissa på ett ord..\" autofocus>\n    </div>\n  </div>\n  <div id=\"crayons\">\n    <h1>KRITA</h1>\n    <ul id=\"sizes\">\n      <li class=\"size-5\"><a href=\"#\" data-size=\"5\"></a></li>\n      <li class=\"size-10\"><a href=\"#\" data-size=\"10\"></a></li>\n      <li class=\"size-15\"><a href=\"#\" data-size=\"15\"></a></li>\n      <li class=\"size-20\"><a href=\"#\" data-size=\"20\"></a></li>\n    </ul>\n    <h1>FÄRG</h1>\n    <ul id=\"colors\">\n      <li class=\"white\"><a href=\"#\" data-color=\"white\"></a></li>\n      <li class=\"black\"><a href=\"#\" data-color=\"black\"></a></li>\n      <li class=\"red\"><a href=\"#\" data-color=\"red\"></a></li>\n      <li class=\"orange\"><a href=\"#\" data-color=\"orange\"></a></li>\n      <li class=\"yellow\"><a href=\"#\" data-color=\"yellow\"></a></li>\n      <li class=\"yellowgreen\"><a href=\"#\" data-color=\"yellowgreen\"></a></li>\n      <li class=\"green\"><a href=\"#\" data-color=\"green\"></a></li>\n      <li class=\"lightskyblue\"><a href=\"#\" data-color=\"lightskyblue\"></a></li>\n      <li class=\"dodgerblue\"><a href=\"#\" data-color=\"dodgerblue\"></a></li>\n      <li class=\"violet\"><a href=\"#\" data-color=\"violet\"></a></li>\n      <li class=\"pink\"><a href=\"#\" data-color=\"pink\"></a></li>\n      <li class=\"burlywood\"><a href=\"#\" data-color=\"burlywood\"></a></li>\n      <li class=\"saddlebrown\"><a href=\"#\" data-color=\"saddlebrown\"></a></li>\n      <li class=\"brown\"><a href=\"#\" data-color=\"brown\"></a></li>\n    </ul>\n  </div>\n</div>\n\n<div id=\"gameplan\">\n  <div id=\"timer\">\n    <div id=\"timer-progress\"></div>\n  </div>\n  <div id=\"artboard-wrapper\">\n    <canvas id=\"artboard\" width=\"800\" height=\"600\"></canvas>\n  </div>\n</div>\n";
  return buffer;
  });
})();