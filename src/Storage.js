var Storage = function() {
  this._inits = [];
};

/* Registers an init method.
  init methods should do two things
    check to see if data is stored, if it is use it.
    set some blank data if there's none.
  inits return a promise so we can wait for them all to finish.
*/
Storage.prototype.registerInit = function(initFunc) {
  this._inits.push(initFunc);
}

Storage.prototype.init = function() {
  var self = this;
  var results = this._inits.map(function(one){return one();})
  return Promise.all(results)
    .catch(function(err){
      console.error(err)
    });

};

Storage.prototype.get = function(key) {
  return localforage.getItem(key);
}

Storage.prototype.set = function(key, value) {
  return localforage.setItem(key, value);
}
