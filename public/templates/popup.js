(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['popup.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

function program5(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.extra) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.extra; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program7(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.extra) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.extra; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  }

  buffer += "<div id=\"popup\">\n  <div class=\"title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div>\n  <div class=\"message\">";
  stack1 = helpers['if'].call(depth0, depth0.escape, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n  <div class=\"extra\">";
  stack1 = helpers['if'].call(depth0, depth0.escape, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\n</div>\n";
  return buffer;
  });
})();