var SelectorView = function() {

  this.$new    = document.getElementById('language-new');
  this.$edit   = document.getElementById('language-edit');
  this.$remove = document.getElementById('language-remove');
  this.$select = document.getElementById('language-select');

  this.$new.addEventListener(    'click',  this.onNewClick.bind(this) );
  this.$remove.addEventListener( 'click',  this.onRemoveClick.bind(this) );
  this.$edit.addEventListener(   'click',  this.onEditClick.bind(this) );
  this.$select.addEventListener( 'change', this.onSelectChange.bind(this) );

  this.renderLanguages();

  if (app.selection.get() !== null) {
    this.onSelectChange();
  }

};

SelectorView.prototype.onSelectChange = function() {
  var key = this.getSelected();
  if (key === 'null') { return; }
  var lng = app.languages.get(key);
  app.selection.set(key);

  app.wordFinder = new WordFinder({
    letters : lng.letters,
    corpus  : lng.corpus,
    list    : lng.list,
    voided  : lng.voided
  });
}

SelectorView.prototype.onNewClick = function(e) {
  e.preventDefault();
  app.newView.show();
};

SelectorView.prototype.onEditClick = function(e) {
  e.preventDefault();
  app.newView.show();
  app.newView.load(this.getSelected());
};

SelectorView.prototype.onRemoveClick = function(e) {
  e.preventDefault();
  return app.languages.remove(this.getSelected())
    .then(function() {
      app.selectorView.renderLanguages();
    });
};

SelectorView.prototype.getSelected = function() {
  return this.$select.options[this.$select.selectedIndex].value;
};

SelectorView.prototype.renderLanguages = function() {
  var languages = app.languages.all();
  if (languages.length === 0) {
    return this.$select.innerHTML = "<option selected disabled value='null'>None</option>";
  }

  var html = languages.map(function(lng, i) {
      var selected = (app.selection.get() === lng.key) ? 'selected' : '';
      return "<option value='"+lng.key+"' "+selected+">"+lng.name+"</option>";
    }).join('');

  this.$select.innerHTML = html;
};
