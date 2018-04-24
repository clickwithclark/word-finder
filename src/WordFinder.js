var WordFinder = function(opts) {

    if (opts == undefined) {
        opts = {};
    }

    this._lng   = new Language();
    this._corpus = new Corpus();
    this._corpus.language(this._lng);

    if (opts.letters !== undefined) {
        this._lng.letters(opts.letters);
    }

    if (opts.voided !== undefined) {
        this._lng.setVoided(opts.voided);
    }

    if (opts.corpus !== undefined) {
        this._corpus.words(opts.corpus);
    }

    /* try to make a tree if possible */
    this.makeTree();

};



/*
* Mutators
*/

WordFinder.prototype.setLetters = function(value) {

this._lng.letters(value);

// Update the corpus.
this._corpus.process();

};

//
WordFinder.prototype.setWords = function(value) {
this._corpus.words(value);
};

WordFinder.prototype.setList = function(value) {
this._corpus.list(value);
};

WordFinder.prototype.setVoided = function(value) {
this._lng.setVoided(value);
};




/*
Populates dictionary tree from corpus
*/
WordFinder.prototype.makeTree = function() {

    /* Blank out the word tree and frequency map. No need to save old ones. */
    this.wordTree = {};

    /* return unless we're ready */
    if (!this._corpus.isReady()) {
        return [];
    }

    if (!this._lng.isReady()) {
        return [];
    }

    /* go through all the words */
    for (var wordIndex = 0, wordCount = this._corpus.length(); wordIndex < wordCount; wordIndex++) {

        // Work with this word
        var word = this._corpus.word(wordIndex);

        // work with a temporary root
        var tempBranch = this.wordTree;

        /* this should be a while loop
        because we control the progression through the word
        based on what has been found. */
        var letterIndex = 0;
        var wordLen = word.length;
        while (letterIndex < wordLen) {
        var candidate = [];

        /*
        start with the longest multigraph possible (greedy?) OR
        start with however many letters we have left
            */
        var longestPossible = Math.min(this._lng.longest(), wordLen - letterIndex);

        /* build array of multigraph candidates to test from our position */
        for (var j = 0; j < longestPossible; j++) {
            candidate[j] = "";
            for (var l = 0; l < j+1; l++) {
            candidate[j] = candidate[j] + word[letterIndex + l];
            }
        }

        var found = false;

        /* start looking for possible words */
        for (var j = longestPossible-1; j > -1; j--){

            if (found) {
            break;
            }

            /* if the candidate is a valid letter/multigraph */
            if ( this._lng.isValid(candidate[j]) ) {
            /* add to the temp branch */
            if (!tempBranch[candidate[j]]) {
                tempBranch[candidate[j]] = {};
            }

            /* move down the word, */
            letterIndex = letterIndex + candidate[j].length;

            // if we're at the end of the word
            if (letterIndex === wordLen) {

                // terminate the branches
                if (tempBranch[candidate[j]] != null) {
                tempBranch[candidate[j]]["."] = true;
                } else {
                tempBranch[candidate[j]] = {
                    ".": true
                };
                }
            } else {
                // if we're not at the end of the word keep going
                tempBranch = tempBranch[candidate[j]];
            }
            found = true;
            }
        }

        // this will ensure we exit the loop if nothing is found
        // This really shouldn't occur, but since it's a while loop
        // I'm not taking any chances.
        if (!found) {
            break;
        }
        }
    }
}; // END of makeTree

/* search function, looks recurssively for words from supplied letters */
WordFinder.prototype.findWords = function(opts) {

    var letters = opts.letters;

    var min    = opts.min;
    var max    = opts.max;

    var filter;
    if (opts.filter === '') {
        filter = []
    } else {
        filter = opts.filter.split(/\s+/);
    }


    if (letters == null) {
        letters = "";
    }

    if (typeof letters === "string") {
        letters = letters.split(/\s+/);
    }

    // Create a letter hash for quick lookup
    var letterHash = letters.reduce(function( obj, cur, ind, arr ){
        obj[cur] = true;
        return obj
    }, {});

    /* recurssive private method */
    var _findWords = function(node, letterHash, current_word) {
        var child_words, key, value, words;
        words = [];

        /* end condition */
        for (key in node) {
        value = node[key];

        /* work */
        if (key === ".") {
            words.push(current_word);
        }

        /* work */
        if (letterHash[key]) {

            /* recurssive step */
            child_words = _findWords(value, letterHash, current_word + key);

            /* work */
            if (child_words.length !== 0) {
            words = words.concat(child_words);
            }
        }
        }
        return words;
    };

    /*
        * Filter the results
        */

    var foundWords = _findWords(this.wordTree, letterHash, "");

    if (min !== 1) {
        foundWords = foundWords.filter(function(word){ return word.length >= min});
    }

    if (!Number.isNaN(max)) {
        foundWords = foundWords.filter(function(word){return word.length <= max});
    }

    if (filter.length !== 0) {
        var rx = new RegExp(filter.join('|'),"g");
        foundWords = foundWords.filter(function(word){return ! Boolean(word.match(rx))});
    }

    if (opts.frequency === true) {
        foundWords = foundWords.map(function(word){
        return {
            word: word,
            frequency: this._corpus.frequency(word)
        }
        }, this);

    }

    return foundWords

};
