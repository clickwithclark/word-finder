var PermutatorView = function(){

  this.permutables = [{type:'',letter:''}];
  this.rule = '';

  this.$ = {
    letters : document.getElementById('permute-letters'),
    add : document.getElementById('permute-add'),
    rule : document.getElementById('permute-rule'),
    output : document.getElementById('permute-output')

  };

  this.$.letters.addEventListener('click', this.onTableClick.bind(this));
  this.$.letters.addEventListener('change', this.onTableChange.bind(this));
  this.$.add.addEventListener('click', this.onAddClick.bind(this));
  this.$.rule.addEventListener('change', this.onRuleChange.bind(this));
  this.render();
};

PermutatorView.prototype.onRuleChange = function(){
  this.rule = this.$.rule.value;
  this.renderPermutations();
};

PermutatorView.prototype.renderPermutations = function(){

  for (var i = 0, len = this.permutables.length; i < len; i++) {
    if (this.permutables[i].type === '' || this.permutables[i].letter === '') {
      return null;
    }
  }

  var permutations = this.permute(this.permutables);

  var splitRule = this.rule.split('');
  if (splitRule.length > 0) {
    permutations = permutations.filter(function(el){
      // return false, unless all the rules are met
      var previousResult = true;
      for (var i = 0, len = el.length; i < len; i++) {
        if (el[i].type !== splitRule[i]) {
          return false;
        }
      }
      return true;
    });
  }

  this.$.output.innerHTML = permutations.map(function(obj){return obj.map(function justLetter(el){return el.letter}).join(" ")}).join("\n");

};

PermutatorView.prototype.permute = function(input){
  var permArr = [],
    usedChars = [];

  var innerPermute = function(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      innerPermute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr
  };
  return innerPermute(input);
};

PermutatorView.prototype.onTableChange = function(e) {
  var target = e.target;
  var index = target.getAttribute('data-index');
  var field = target.getAttribute('data-field');
  this.permutables[index][field] = target.value;
  this.renderPermutations();
};


PermutatorView.prototype.onTableClick = function(e) {
  e.preventDefault();
  var target = e.target;
  var action = target.getAttribute('data-action');
  if (action === 'remove') {
    var index = target.getAttribute('data-index');
    this.permutables.splice(index, 1)
    this.render();
  }

};

PermutatorView.prototype.render = function() {
  this.$.letters.innerHTML = "" +
    "<tr>" +
    "  <th class='pure-u-1-3'>Letter</th><th class='pure-u-1-3'>Type</th>" +
    "</tr>" +
    "<tr>" +
    this.permutables.map(function(p,i){
      return "" +
        "<td class='pure-u-1-3'><input data-index='"+i+"' data-field='letter' value='"+p.letter+"' class='pure-u-1'></td>" +
        "<td class='pure-u-1-3'><input data-index='"+i+"' data-field='type' value='"+p.type+"' class='pure-u-1'></td>" +
        "<td class='pure-u-1-3'><button data-index='"+i+"' data-action='remove' class='pure-button'>X</button></td>";
    }).join('') +
    "</tr>";

};

PermutatorView.prototype.onAddClick = function(e) {
  e.preventDefault();
  this.permutables.push({letter:'',type:''});
  this.render();
};