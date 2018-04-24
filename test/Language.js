
// mocha, travisCI
require('mocha');
expect = require('chai').expect;
var Language = require('../js/wflib/Language.js');


describe('Initialization', function() {
  it('should work with no arguments', function() {
    var lng = new Language();
    expect(lng).to.be.ok;
  });
  it('should work with blank arguments', function() {
    var lng = new Language({});
    expect(lng).to.be.ok;
  });
  it('should work with empty arguments', function() {
    var lng = new Language({
      letters: '',
      voided: ''
    });
    expect(lng).to.be.ok;
  });

});

describe('Letter processing', function() {
  it('should split letters', function() {
    var lng = new Language({
      letters: 'A b Ch d'
    });
    expect(lng._letters).to.eql(['a', 'b', 'ch', 'd']);
  });

  it('should split voided letters', function() {
    var lng = new Language({
      voided: 'a'
    });
    expect(lng.voidFilter('something-a')).to.eql(false);
    expect(lng.voidFilter('something-b')).to.eql(true);
  });

  it('should initialize with letters and void set ', function() {
    var lng = new Language({
      letters: 'A b Ch d',
      voided: 'a'
    });
    expect(lng.voidFilter('something-a')).to.eql(false);
    expect(lng.voidFilter('something-b')).to.eql(true);
  });

});

describe('Letter processing setters', function() {
  it('should set letters', function(){
    var lng = new Language();
    lng.letters('a b ch d -- ∑')
    expect(lng._letters).to.eql(['a', 'b', 'ch', 'd', '--', '∑']);
  });
  it('should set voided letters', function(){
    var lng = new Language();
    lng.voided('a')
    expect('a'.match(lng._rxVoided)).to.eql(['a']);
    expect('b'.match(lng._rxVoided)).to.not.eql(['b']);
  });
});

describe('Status methods', function(){

})

/*

describe('Letter processing setter', function() {
  beforeEach(function() {
    return this.wordFinder = new WordFinder;
  });
  it('should split letters', function() {
    this.wordFinder.setLanguageLetters('a b c d e f gh');
    return expect(this.wordFinder.languageLetters).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'gh']);
  });
  return it('should recognize multigraphs', function() {
    this.wordFinder.setLanguageLetters('abcdefghi jklmnopq');
    return expect(this.wordFinder.longestMultigraph).to.equal(9);
  });
});

describe('Word processing', function() {
  beforeEach(function() {
    return this.wordFinder = new WordFinder({
      languageLetters: 'a b ch d',
      words: 'dada add bad bach dabble'
    });
  });
  it('should split words', function() {
    return expect(this.wordFinder.words).to.include('dada');
  });
  it('should filter split words', function() {
    return expect(this.wordFinder.words).to.not.include('dabble');
  });
  return it('should not alter words', function() {
    return expect(this.wordFinder.words).to.eql(['dada', 'add', 'bad', 'bach']);
  });
});

describe('Word processing setter', function() {
  beforeEach(function() {
    return this.wordFinder = new WordFinder({
      languageLetters: 'a b ch d'
    });
  });
  it('should split words', function() {
    this.wordFinder.setWords('dada add bad bach dabble');
    return expect(this.wordFinder.words).to.include('dada');
  });
  it('should filter split words', function() {
    this.wordFinder.setWords('dada add bad bach dabble');
    return expect(this.wordFinder.words).to.not.include('dabble');
  });
  it('should not alter words', function() {
    this.wordFinder.setWords('dada add bad bach dabble');
    return expect(this.wordFinder.words).to.eql(['dada', 'add', 'bad', 'bach']);
  });
  return it('should refilter words', function() {
    this.wordFinder.setWords('dada add bad bach dabble');
    this.wordFinder.setLanguageLetters('a b d l e');
    return expect(this.wordFinder.words).to.eql(['dada', 'add', 'bad', 'dabble']);
  });
});

describe('Word finding', function() {
  it('should return found words', function() {
    this.wordFinder = new WordFinder({
      languageLetters: 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
      words: 'I\'m a little teapot short and stout.'
    });
    return expect(this.wordFinder.findWords('a d n')).to.eql(['a', 'and']);
  });
  return it('should return found words with digraphs', function() {
    this.wordFinder = new WordFinder({
      languageLetters: 'a á b c d e é f g h i í j k l ll m n ñ o ó p q r s t u ú v w x y z',
      words: 'Me llaman el desaparecido, fantasma que nunca ésta.'
    });
    return expect(this.wordFinder.findWords('a ll m n')).to.eql(['llaman']);
  });
});
*/