var Selection = function() {
  this._selection = '';
  app.storage.registerInit(this.init);
};

Selection.prototype.init = function() {
  var self = this;
  return app.storage.get('selection')
    .then(function(selection){
      if (selection !== null) {
        self._selection = selection;
      }
      app.storage.set('selection', '');
    });
};

Selection.prototype.set = function(index) {
  this._selection = index;
  app.storage.set('selection', index);
};

Selection.prototype.get = function() {
  return this._selection;
};
