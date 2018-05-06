
/* Modified from original code  https://github.com/bahmutov/boggle thanks to
   "Gleb Bahmutov <gleb.bahmutov@gmail.com>" 
	Selected for it's use of matrix-paths (Simple depth first traversal for 2D grids)
 */

var check = require('check-types');
var verify = check.verify;
var _ = require('lodash');
var paths = require('matrix-paths-zolmeister').paths;
var dictionary = require('prefix-dictionary');

var __ = require('underscore');

function verifyGridOfChars(grid) {
  check.verify.array(grid, 'expected an Array');

  console.assert(grid.every(function (row) {
    return row.every(function (value) {
      return check.string(value) && check.length(value, 1);
    });
  }), 'expected grid of characters');
}

function verifyGridOfStrings(grid) {
  check.verify.array(grid, 'expected an Array');

  console.assert(grid.every(function (row) {
    return row.every(function (value) {
      return check.string(value)
    });
  }), 'expected grid of strings');
}

function unary(fn) {
  return function (a) {
    return fn(a);
  };
}

function validWords(words) {
  return words.filter(function (word) {
    return word.length > 2;
  });
}

verify.fn(paths, 'paths is not a function');

function report(words) {
  verify.array(words, 'expected array of words');
  words.sort();
  words.forEach(unary(console.log));
  var n = words.reduce(function (sum, word) {
    return sum + word.length;
  }, 0);
  console.log(words.length + ' words');
  console.log(n + ' letters');
}

function boggleString(letters) {
  letters = letters.toLowerCase();
  var grid = [
    letters.substr(0, 4).split(''),
    letters.substr(4, 4).split(''),
    letters.substr(8, 4).split(''),
    letters.substr(12, 4).split('')
  ];
  return boggleGrid(grid);
}

function boggleGrid(gridOfCharacters) {

  verifyGridOfStrings(gridOfCharacters);
  console.assert(gridOfCharacters.length > 0, 'empty array');

  verify.fn(dictionary.isWord, 'missing isWord');
  verify.fn(dictionary.isWordPrefix, 'missing isWordPrefix');

  var lowerCased = gridOfCharacters.map(function (row) {
    return row.map(function (str) {
      return str.toLowerCase();
    });
  });

  console.log('lowerCased:')
  console.log(JSON.stringify(lowerCased))

  var uniqueWords = {};
  var uniquePaths = {}; // added this

  paths(lowerCased, {
    // added path parm and modified internal pathsFrom and dfs function
    stepWhile: function (str, x, y, path, grid) {

      console.log('str = '+ str + ' x:'+x + ' y:'+y)

      if (dictionary.isWord(str)) {
        // found whole word, maybe there is more!
        uniqueWords[str] = true;
        uniquePaths[str] = path;
 
        return true;
      }

      if (dictionary.isWordPrefix(str)) {
        // not a word, but possible
        return true;
      }
    }
  });

  var words = Object.keys(uniqueWords);
  words = validWords(words);

  const filteredPaths = Object.keys(uniquePaths)
  .filter(key => words.includes(key))
  .reduce((obj, key) => {
    obj[key] = uniquePaths[key];
    return obj;
  }, {});
 
  const rank = gridOfCharacters.length;
  var tree_data = {'name': 'Board', children:[]}

  var char_to_indices_hash = {};
  var indices_to_char_hash = {};
  gridOfCharacters.map(function (row, i) {
     row.map(function (str, j) {
     char_to_indices_hash[str] = i+'_'+j
     indices_to_char_hash[i+'_'+j] = str
     // init the root node with all board letters
     tree_data.children.push({name:  i+'_'+j , 
                              label: str
                              })
      });
  });

  function buildtree(tree, in_path){

    var in_path_steps = in_path.split(';')
    var n_in_path_steps = in_path_steps.length

    if(n_in_path_steps > 1){

      if (typeof tree.children === 'undefined'){
        tree.children = []
      }

      var the_child = __.find(tree.children, function(x){ return x.name == in_path_steps[0]; });
      
      // check and see if this child is there 
       if(typeof the_child === 'undefined' || the_child.length==0){
 
          tree.children.push({name: in_path_steps[0], 
                              label: indices_to_char_hash[in_path_steps[0]] 
                              })

          in_path_steps.shift()
          var next_path_string = in_path_steps.join(';')
          buildtree(tree.children[0], next_path_string)

       }else{

          in_path_steps.shift()
          var next_path_string = in_path_steps.join(';')
          buildtree(the_child, next_path_string)
       }
 
    }else if(n_in_path_steps == 1){

      if (typeof tree.children === 'undefined'){
        tree.children = []
      }

       var the_child = __.find(tree.children, function(x){ return x.name == in_path_steps[0]; });
      
      // check and see if this child is there 
       if(typeof the_child === 'undefined' || the_child.length==0){
 
          tree.children.push({name: in_path_steps[0],
                              label: indices_to_char_hash[in_path_steps[0]] 
                              })
 

       } 

       return tree;
 
    }
  } //buildtree

  var sample_path = filteredPaths[Object.keys(filteredPaths)[0]]
  console.log('sample_path' + sample_path)

  // build the tree needed for radial tree layout
  __.each(Object.keys(filteredPaths), function(x,i){
      // have to .substring(1) to remove the _prefix
      console.log(filteredPaths[x].substring(1))
      buildtree(tree_data, filteredPaths[x].substring(1))
  })
 
  return {words: words, paths: filteredPaths, tree: tree_data};

}

function boggle(str) {

  console.log('boggle on', str);

  if (check.string(str)) {
    str = str.replace(/\s/g, '');
    if (str.length === 16) {
      return boggleString(str);
    }
  }

  if (check.array(str) && (str.length === 4)) {
    return boggleGrid(str);
  }

  // support a single array as input
  if (check.array(str) && (str.length === 16)) {
    var grid = [
      str.slice(0, 4),
      str.slice(4, 8),
      str.slice(8, 12),
      str.slice(12, 16),
    ];
    return boggleGrid(grid);
  }
  throw new Error('Invalid boggle input ' + JSON.stringify(str));
}

boggle.generate = function () {
  var dice = ["AAEEGN", "ELRTTY", "AOOTTW", "ABBJOO", "EHRTVW", "CIMOTU",
  "DISTTY", "EIOSST", "DELRVY", "ACHOPS", "HIMNQU", "EEINSU", "EEGHNW",
  "AFFKPS", "HLNNRZ", "DEILRX"];

  return _.map(_.shuffle(dice), function (die) {
    var letter = _.sample(die);
    return letter === 'Q' ? 'Qu' : letter;
  });
};

boggle.score = function (word) {
  var len = word.length;
  if (len <= 2) return 0;
  else if (len <= 4) return 1;
  else if (len <= 5) return 2;
  else if (len <= 6) return 3;
  else if (len <= 7) return 5;
  else return 11;
};

module.exports = {    
    boggle: boggle
}