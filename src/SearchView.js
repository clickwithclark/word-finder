var SearchView = function() {

  this.$ = {
    letters  : document.getElementById('search-letters'),
    found    : document.getElementById('search-found'),
    min      : document.getElementById('search-min'),
    max      : document.getElementById('search-max'),
    filter   : document.getElementById('search-filter'),
    run      : document.getElementById('search-run'),
    sequence : document.getElementById('search-sequence'),
    newOnly  : document.getElementById('search-new-only')
  };

  this.$.run.addEventListener('click', this.search.bind(this) );
  this.$.sequence.addEventListener('click', this.sequence.bind(this) );

};

SearchView.prototype.search = function() {

  var letters = this.get('letters');
  var filter = this.get('filter');
  var min = Number(this.get('min'));
  var max = Number(this.get('max'));

  var found = app.wordFinder.findWords({
    letters : letters,
    min: min,
    max : max,
    filter: filter,
  });

  this.$.found.innerHTML = found.join(", ");
}


SearchView.prototype.sequence = function() {

  // Get some handles
  var letters = this.get('letters');
  var filter = this.get('filter');
  var min = Number(this.get('min'));
  var max = Number(this.get('max'));

  var newOnly = this.$.newOnly.checked;

  var rows = letters.split(/\n/).map(function(row){
    return row.split(/\s+/);
  });

  var sequences = rows.map(function(row){
    var letters = row;
    var finds = [];
    for (var i = 1, lLen = letters.length + 1; i < lLen; i++) {
      var searchLetters = '';
      for (var j = 0; j < i; j++) {
        searchLetters += letters[j] + " ";
      }

      finds.push({search:searchLetters,words:app.wordFinder.findWords({
        letters : searchLetters,
        min: min,
        max : max,
        filter: filter,
        frequency: true
      })});
    }

    var wordHash = finds.map(function(one) {
      return one.words.reduce(function(obj, cur, ind, arr) {
        obj[cur.word] = true;
        return obj;
      },{});
    });

    var output = finds.map(function(one, i){

      if (i > 0) {

        if (newOnly) {
          one.words = one.words.filter(function(word, j){
            return !wordHash[i-1][word.word];
          });
        } else {
          one.words.forEach(function(word, j){
            if (!wordHash[i-1][word.word]) {
              one.words[j].isNew = true;
            }
          });
        }

        one.words = one.words.sort(function byFreq(a, b){
          var an = a.isNew, bn = b.isNew;
          if ( an === bn ) {
            var af = a.frequency, bf = b.frequency;
            return (af < bf) ? 1 : ( af > bf ) ? -1 : 0;
          }
          return (an) ? -1 : 1;

        });

      }

      return one.search + " (" + one.words.length + ")\t\n" +
        one.words.map(function(word) {
          var star = (word.isNew) ? "* " : '';
          return star + word.word + "\t " + word.frequency;
        }).join("\n")
    }).join("\n\t\n");

    return {
      sequence: output,
      order : letters
    };

  });

  splitSequences = sequences.map(function(sequence, i){
    return sequence.sequence.split('\n');
  });

  sequences.forEach(function(sequence, i) {
    splitSequences[i].unshift("Sequence "+(i+1)+" ("+sequence.order.join(", ")+")\t");
  });

  var longest = Math.max.apply(null, splitSequences.map(function(el){return el.length}) );
  var output = '';
  for (var i = 0; i < longest; i++) {
    for (var j = 0, len = splitSequences.length; j < len; j++) {
      if (splitSequences[j][i] !== undefined ) {
        output += splitSequences[j][i] + "\t\t";
      } else {
        output += "\t\t\t";
      }
    }
    output += "\n";
  }

  /*var output = sequences.map(function(sequence, i){
    return "Sequence "+(i+1)+" ("+sequence.order.join(", ")+")\n"+sequence.sequence;
  }).join("\n\n");*/

  this.$.found.innerHTML = output;

}


SearchView.prototype.get = function(key) {
  return this.$[key].value;
};
