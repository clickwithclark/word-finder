/*
   * Language class handles language specific features.
   * Mutators generate regex for filtering.
   * used by Corpus objects.
   */



  var Language = function() {

    this._raw               = ''; // plain text of the original letters
    this._letters           = [];             // processed array of letters
    this._longestMultigraph = 0;              // letter count of longest multigraph
    this._rxDisallowed      = null;           // regex matches letters that are not the letters of the language
    this._voided            = '';             // specifically excluded letters
    this._rxVoided          = null;

  };

  Language.prototype.isReady = function() {
    return this._letters.length > 0;
  };

  Language.prototype.letters = function(letters) {

    /* only work with lowercase */
    letters = letters.toLowerCase();

    this._raw = letters;
    this._voided = '';
    this._rxVoided = null;

    this.process();

  };

  Language.prototype.process = function() {

    /* save disallowed letters for later */
    this._rxDisallowed = new RegExp("[^\\s" + this._raw + "]", "g");

    /* make an array, of language letters */
    this._letters = this._raw.split(/\s+/);

    // Create a object hash to quickly look up whether a letter exists. (no indexOf)
    this._letterHash = this._letters.reduce(function( obj, cur, ind, arr ) {
      obj[cur] = true;
      return obj
    }, {});

    // find longest multigraph
    this._longestMultigraph = Math.max.apply(this, [0].concat(this._letters.map(function(a) {
      return a.length;
    })));
  };

  Language.prototype.longest = function() {
    return this._longestMultigraph;
  };

  Language.prototype.setVoided = function(voidedCharacters) {
    if (voidedCharacters === null) {
      this._voided = '';
      this._rxVoided = null;
      return ;
    }
    this._voided = voidedCharacters.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
    this._rxVoided = new RegExp("["+this._voided+"]", "g");

    this.voidFilter = Language.prototype.voidFilter.bind(this);

  };

  Language.prototype.hasVoided = function(){
    return this._voided !== '';
  };

  Language.prototype.voidFilter = function(word) {
    return ! word.match(this._rxVoided);
  };

  Language.prototype.isValid = function(word) {
    return this._letterHash[word];
  };

  Language.prototype.disallowed = function(){
    return this._rxDisallowed;
  }