
  var Corpus = function() {
	this._raw   = '';  // raw words
	this._words = []; // list of words
	this._lng   = null; // Language object used for filtering
	this._list  = ''; // word list
	this._frequencyMap = {}; // list of word frequency for easy lookup
  };

  Corpus.prototype.language = function(lng) { this._lng = lng; }

  Corpus.prototype.length = function() { return this._words.length; }

  Corpus.prototype.words = function(value) {

	this._raw = value;

	this.process();

  };

  // counts words
  Corpus.prototype.countWord = function(word) {
	if (this._frequencyMap[word] === undefined) { this._frequencyMap[word] = 0; }
	this._frequencyMap[word]++;
  };


  Corpus.prototype.list = function(value) {
	this._list = value;
	this.processList();
  };

  Corpus.prototype.processList = function() {
	this._words = [];
	var rows = this._list.split("\n");
	rows.forEach(function(row){
	  var pair = row.split(/\s,\s/);
	  var word = pair[0];
	  var count = pair[1];
	  this._words.push(word);
	  this._frequencyMap[word] = count;
	}, this);
  };


  Corpus.prototype.word = function(index) {
	return this._words[index];
  };

  Corpus.prototype.process = function() {

	/* check for raw words */
	if ( this._raw === '' && this._list === '') {
	  return null;
	} else if (this._list !== '') {
	  return this.processList();
	}

	/* only work with lowercase */
	var w = this._raw.toLowerCase();

	/* If there are symbols that void words,
	then a split, filter, join step is done first.
	*/
	if (this._lng.hasVoided()) {
	  w = w.split(/\s+/);
	  w = w.filter(this._lng.voidFilter);
	  w = w.join(' ');
	};

	// remove the non-word related symbols
	w = w.replace(this._lng.disallowed(), ' ');

	// convert to array
	w = w.split(/\s+/);

	// count for frequency map
	this._frequencyMap = {};
	w.forEach(function(word){this.countWord(word)}, this);

	// save words
	return this._words = w;

  };

  Corpus.prototype.frequency = function(word) {
	return this._frequencyMap[word];
  };

  Corpus.prototype.isReady = function() {
	return this._words.length > 0;
  };