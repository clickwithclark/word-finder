
if require? # node.js, TravisCI

  require( 'mocha' )
  expect = require( 'chai' ).expect
  WordFinder = require( '../word-finder.js' )
else # testem

  expect = chai.expect

describe 'Initialization', ->

  it 'should work blank', ->
    wordFinder = new WordFinder
    expect(wordFinder).to.be.ok

  it 'should work with options', ->
    wordFinder = new WordFinder
      languageLetters : 'a b c'
      words : 'hey how are you?'
    expect(wordFinder).to.be.ok

describe 'Letter processing', ->

  it 'should split letters', ->
    @wordFinder = new WordFinder
      languageLetters : 'a b ch d'

    expect(@wordFinder.languageLetters).to.eql(['a','b','ch','d'])

  it 'should recognize multigraphs', ->
    @wordFinder = new WordFinder
      languageLetters : 'a b ch d ing'
    expect(@wordFinder.longestMultigraph).to.equal(3)

describe 'Letter processing setter', ->

  beforeEach ->
    @wordFinder = new WordFinder

  it 'should split letters', ->
    @wordFinder.setLanguageLetters 'a b c d e f gh'
    expect(@wordFinder.languageLetters).to.eql(['a','b','c','d','e','f','gh'])

  it 'should recognize multigraphs', ->
    @wordFinder.setLanguageLetters 'abcdefghi jklmnopq'
    expect(@wordFinder.longestMultigraph).to.equal(9)


describe 'Word processing', ->

  beforeEach ->
    @wordFinder = new WordFinder
      languageLetters : 'a b ch d'
      words: 'dada add bad bach dabble'

  it 'should split words', ->
    expect(@wordFinder.words).to.include('dada')

  it 'should filter split words', ->
    expect(@wordFinder.words).to.not.include('dabble')

  it 'should not alter words', ->
    expect(@wordFinder.words).to.eql(['dada','add','bad','bach'])


describe 'Word processing setter', ->

  beforeEach ->
    @wordFinder = new WordFinder
      languageLetters : 'a b ch d'

  it 'should split words', ->
    @wordFinder.setWords 'dada add bad bach dabble'
    expect(@wordFinder.words).to.include('dada')

  it 'should filter split words', ->
    @wordFinder.setWords 'dada add bad bach dabble'
    expect(@wordFinder.words).to.not.include('dabble')

  it 'should not alter words', ->
    @wordFinder.setWords 'dada add bad bach dabble'
    expect(@wordFinder.words).to.eql(['dada','add','bad','bach'])

  it 'should refilter words', ->
    @wordFinder.setWords 'dada add bad bach dabble'
    @wordFinder.setLanguageLetters 'a b d l e'
    expect(@wordFinder.words).to.eql([ 'dada', 'add', 'bad', 'dabble' ])


describe 'Word finding', ->

  it 'should return found words', ->
    @wordFinder = new WordFinder
      languageLetters : 'a b c d e f g h i j k l m n o p q r s t u v w x y z'
      words: 'I\'m a little teapot short and stout.'
    expect(@wordFinder.findWords('a d n')).to.eql(['a','and'])

  it 'should return found words with digraphs', ->
    @wordFinder = new WordFinder
      languageLetters : 'a á b c d e é f g h i í j k l ll m n ñ o ó p q r s t u ú v w x y z'
      words: 'Me llaman el desaparecido, fantasma que nunca ésta.'
    expect(@wordFinder.findWords('a ll m n')).to.eql(['llaman'])


