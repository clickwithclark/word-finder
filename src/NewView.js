var NewView = function() {

  this.$ = {
    key     : document.getElementById('language-key'),
    name    : document.getElementById('language-name'),
    letters : document.getElementById('language-letters'),
    voided  : document.getElementById('language-voided'),
    corpus  : document.getElementById('language-corpus'),
    list    : document.getElementById('language-list'),
    save    : document.getElementById('language-save'),
    form    : document.getElementById('language-new-form'),
    close   : document.getElementById('language-close')
  };

  this.$.save.addEventListener( 'click',  this.onSaveClick.bind(this) );
  this.$.close.addEventListener('click',  this.onCloseClick.bind(this) );

};

NewView.prototype.load = function(key) {

  var lng = app.languages.get(key);

  this.$.key.value     = lng.key;
  this.$.name.value    = lng.name;
  this.$.letters.value = lng.letters;
  this.$.corpus.value  = lng.corpus;
  this.$.list.value    = lng.list;
  this.$.voided.value  = lng.voided;
};

NewView.prototype.onSaveClick = function(e) {
  e.preventDefault();
  var self = this;
  app.wordFinder = new WordFinder({
    letters : this.getValue('letters'),
    corpus  : this.getValue('corpus'),
    list    : this.getValue('list'),
    voided  : this.getValue('voided')
  });
  var newKey = (Math.round(Math.random() * 1e30)).toString(36);
  app.languages
    .add({
      key     : newKey,
      name    : this.getValue('name'),
      letters : this.getValue('letters'),
      corpus  : this.getValue('corpus'),
      list    : this.getValue('list'),
      voided  : this.getValue('voided')
    }).then(function(){
      app.selection.set(newKey);
      app.selectorView.renderLanguages(app.languages);
      self.hide();
    });
};

NewView.prototype.onCloseClick = function(e){
  e.preventDefault();
  this.hide();
}

NewView.prototype.getValue = function(key) {
  return this.$[key].value
};

NewView.prototype.show = function() {
  this.$.form.style.display = 'block';
  this.clear();
};

NewView.prototype.hide = function() {
  this.$.form.style.display = 'none';
  this.clear();
};

NewView.prototype.clear = function(){
  this.$.key.value     = '';
  this.$.name.value    = '';
  this.$.letters.value = '';
  this.$.corpus.value  = '';
  this.$.list.value    = '';
  this.$.voided.value  = '';
}