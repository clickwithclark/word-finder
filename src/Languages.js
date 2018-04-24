var Languages = function() {
  this._languages = [];
  app.storage.registerInit(this.init.bind(this));
};

Languages.prototype.init = function() {
  var self = this;
  return app.storage.get('languages')
    .then(function(languages){
      if (languages !== null) {
        self._languages = languages;
        return
      }
      app.storage.set('languages', []);
    })
};

Languages.prototype.add = function(lng) {

  this._languages.push(lng);
  return localforage.setItem('languages', this._languages);
};

Languages.prototype.remove = function(key) {
  this._languages = this._languages.filter(function(lng){ return lng.key !== key; });
  return localforage.setItem('languages', this._languages);
};

Languages.prototype.get = function(key) {
  var got = this._languages.find(function(lng){ return lng.key === key; });
  if (got === undefined) { console.error('Looked for '+key+'. got nothing.', this._languages); }
  return got;
};

Languages.prototype.first = function() {
  return this._languages[0] || {};
};

Languages.prototype.all = function() {
  return this._languages;
};

Languages.prototype.length = function() {
  return this._languages.length;
};