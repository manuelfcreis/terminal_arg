// Initial variables
let matrixHasPlayed = false
let playCount = 0
let playArray = [false, false, false, false]

// Level Variables
let rabbitStage = false
let mazeStage = false


var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);
  let matrixHasPlayed = false

  let CMDS_ = [
    'cat', 'clear', 'date', 'echo', 'help', 'uname', 'whoami'
  ];

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'cat':
          var url = args.join(' ');
          if (!url) {
            output('Usage: ' + cmd + ' https://s.codepen.io/...');
            output('Example: ' + cmd + ' https://s.codepen.io/AndrewBarfield/pen/LEbPJx.js');
            break;
          }
          $.get( url, function(data) {
            var encodedStr = data.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
               return '&#'+i.charCodeAt(0)+';';
            });
            output('<pre>' + encodedStr + '</pre>');
          });
          break;
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
         if (args.includes('matrix') || args.includes('Matrix')) {
           window.setTimeout(theMatrix(), 1000);
           break;
         } else if (args.includes('rabbit') || args.includes('Rabbit')) {
           write(ascii(rabbit));
           break;
         } else if (args.includes('maze') || args.includes('Maze')) {
           maze();
           break;
         } else {
           output( args.join(' ') );
           break;
         }
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'uname':
          output(navigator.appVersion);
          break;
        case 'whoami':
          var result = "<img src=\"" + codehelper_ip["Flag"]+ "\"><br><br>";
          for (var prop in codehelper_ip)
            result += prop + ": " + codehelper_ip[prop] + "<br>";
          output(result);
          break;
        case 'forward':
          if (mazeStage === true) {
            if (playCount === 0 || 3) {
              playArray[playCount] = true
              if (checkEndGame()) {
                endGame();
                break;
              };
            } else {
              playArray[playCount] = false
            }
            printMaze();
          } else {
            output('forward' + ': command not found');
          }
          break;
        case 'left':
          if (mazeStage === true) {
            if (playCount === 1) {
              playArray[playCount] = true
              if (checkEndGame()) {
                endGame();
                break;
              };
            } else {
              playArray[playCount] = false
            }
            printMaze();
          } else {
            output('left' + ': command not found');
          }
          break;
        case 'right':
          if (mazeStage === true) {
            if (playCount === 2) {
              playArray[playCount] = true;
              if (checkEndGame()) {
                endGame();
                break;
              };
            } else {
              playArray[playCount] = false;
            }
            printMaze();
          } else {
            output('right' + ': command not found');
          }
          break;
        case 'look':
          if (mazeStage === true) {
            if (playCount === 0) {
              output('the cubicle across from you is empty')
            } else if (playCount === 1){
              output('Stay here for just a moment')
            } else if (playCount === 2){
              output('When I tell you, go to the end of the row')
            } else if (playCount === 3){
              output('Go, now')
            }
          } else {
            output('right' + ': command not found');
          }
          break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  function write(html){
    output_.insertAdjacentHTML('beforeEnd', html);
  }

  function ascii(text){
    return text.replace(/\s/g, '&nbsp;');
  }

  // taken from https://stackoverflow.com/questions/7264974/show-text-letter-by-letter
  function typeOut(text, index, interval){
    if (index < text.length) {
      output_.insertAdjacentHTML('beforeEnd', text[index++]);
      setTimeout(function () { typeOut(text, index, interval); }, interval);
    } else {
      write('<br>')
    }

  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }
  // Matrix Functions

  function theMatrix(interval) {
    write('.')
    window.setTimeout(function() { write('.') }, interval + 3000);
    window.setTimeout(function() { write('.') }, interval + 6000);
    window.setTimeout(function() { write('<br>') }, interval + 6000);
    window.setTimeout(function() { typeOut("Wake up Neo", 0, 300) }, interval + 9000);
    window.setTimeout(function() { typeOut("The Matrix has you", 0, 300) }, interval + 15500);
    window.setTimeout(function() { typeOut("Follow the White Rabbit", 0, 300) }, interval + 25500);
    matrixHasPlayed = true
  }

  //
  return {
    init: function() {
        window.setTimeout(function() {
          if (matrixHasPlayed === false) {
            theMatrix(60000);
        }}, 60000);
      },
    output: output
  }
  function maze() {
    CMDS_.push('forward', 'left', 'right', 'look')
    let playCount = 0;
    let playArray = [false, false, false, false];
    mazeStage = true;
    write(ascii(mazeScreen));
  }

  function raisePlayCount() {
    if (playCount < 3) {
      playCount += 1
    } else {
      playCount = 0
    }
  }

  function printMaze() {
    output_.innerHTML = '';
    write(ascii(mazeScreen));
    raisePlayCount();
  }

  function checkEndGame() {
    if (playArray.every(function(element) { return element === true })) {
      return true
    }
  }

  function endGame() {
    output('You won ya filthy animal')
  }
};


const mazeScreen = "    \\                           /         " + "<br>" +
                   "     \\                         /          " + "<br>" +
                   "      \\                       /           " + "<br>" +
                   "       ]                     [            " + "<br>" +
                   "       ]                     [            " + "<br>" +
                   "       ]___               ___[            " + "<br>" +
                   "       ]  ]\\             /[  [            " + "<br>" +
                   "       ]  ] \\           / [  [            " + "<br>" +
                   "       ]  ]  ]         [  [  [            " + "<br>" +
                   "       ]  ]  ]__     __[  [  [            " + "<br>" +
                   "       ]  ]  ] ]     [ [  [  [            " + "<br>" +
                   "       ]  ]  ] ]     [ [  [  [            " + "<br>" +
                   "       ]  ]  ]_]     [_[  [  [            " + "<br>" +
                   "       ]  ]  ]         [  [  [            " + "<br>" +
                   "       ]  ] /           \\ [  [            " + "<br>" +
                   "       ]__]/             \\[__[            " + "<br>" +
                   "       ]                     [            " + "<br>" +
                   "       ]                     [            " + "<br>" +
                   "       ]                     [            " + "<br>" +
                   "      /                       \\           " + "<br>" +
                   "     /                         \\          " + "<br>" +
                   "    /                           \\          " + "<br>";

 let rabbit = "               .,uuuuuu,," + "<br>" +
              "            ,%%uuu==#uuuu%%\\" + "<br>" +
              "        ,,,<%%uu\".a.=#uuuu%%%%" + "<br>" +
              "     ,;;;;;)#uu...,#/uuu%%%%%%%" + "<br>" +
              "       \\;;/####\\%mmmmmmmmmnu%%`%%;" + "<br>" +
              "      u####\"\"\"' (mmmmmmmmmmnu%%`%%%%" + "<br>" +
              "      uuuEE,..:;;#\\mmmmmmmnuu%;,`%%%%" + "<br>" +
              "       uuuu\\#####/uu,mmmmmnu%..;, :.%%%" + "<br>" +
              "          \\uuuuuuuuuuuuu,mnu/\\.;;  :..%%" + "<br>" +
              "            >##&&#######<%%%  \\;'   :.%%" + "<br>" +
              "         (###&&&#######%%%%%         :%'" + "<br>" +
              "       (###&&&&######(%%%%%%" + "<br>" +
              "      (#####&&&####(%%%%%%%%%" + "<br>" +
              "       (###########(%%%%%%%%%%%" + "<br>" +
              "      %%(###########(%%%%%%%%%%%%" + "<br>" +
              "     ;%%%(##########'%%%'%%%%%%%%%" + "<br>" +
              "    (%%%%; ;n####n'%%%%'n%%%%%%%%%%(@)" + "<br>" +
              "     \\%%%' %%nnnn'%%%%'nnnn%%%%%%%(@@@)" + "<br>" +
              "      ``' %%%nnnn``'nnnnnn%%%%%%%%(@@@@)" + "<br>" +
              "         ,%%%nnnnnnnnnnn%%%%%%%%%(@@@@@" + "<br>" +
              "  ,.,nnn%%%%nnnnn)nnnn%%%%%%%%%/  (@@)" + "<br>" +
              " (u(uuuuuuuuuuuuuu/ (u;;;;;;u)" + "<br>" +
              "                     (uuuuuuu)" + "<br>" +
              "                       ()()()" + "<br>";
