window.app = {};

app.boot = function() {
  app.storage = new Storage();
  // put anything that registers storage here
  app.languages = new Languages();
  app.selection = new Selection();

  // initialize everything with storage
  app.storage.init()
    .then(function(){

      app.wordFinder = new WordFinder(app.languages.first());

      /*
       * Initialize UI
       */

      app.permutatorView = new PermutatorView();
      app.searchView     = new SearchView();
      app.newView        = new NewView();
      app.selectorView   = new SelectorView();

    });

};

// window.app.boot when the dom is ready
var checkDomInterval = 10;
var checkDomReady = function() {
  if (document.readyState !== 'complete') {
    return setTimeout(checkDomReady, checkDomInterval *= 2)
  }
  window.app.boot();
};

checkDomReady(); // kick it off