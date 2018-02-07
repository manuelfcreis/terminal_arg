// Initial variables
let phoneIsOn = false
let matrixHasPlayed = false
let playCount = 0
let playArray = [false, false, false, false]
let pillStage = false

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
    'open', 'clear', 'date', 'run', 'help', 'uname', 'whoami'
  ];

  let LIST_ = [
    'README.md', 'assets', 'example_url', 'images'
  ]

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

      if (phoneIsOn) {
        switch (cmd) {
          case '555-0690':
            phoneIsOn = false
            maze()
            break;
          default:
            output('Couldn\'t connect to that phone number, goodbye!')
            phoneIsOn = false
            break;
          };
      } else if (pillStage) {
          switch (cmd) {
            case 'blue':
              location.reload();
              break;
            case 'red':
              redpill();
              break;
            default:
              write("red or blue there is no other choice")
              break;
          }
      } else {
      switch (cmd) {
        case 'open':
          var url = args.join(' ');
          if (!url) {
            output('Usage: ' + cmd + ' website...');
            output('Example: ' + cmd + ' https://www.enso.pt/example_url.html');
            break;
          } else if (url == "https://www.enso.pt/example_url.html") {
            window.open("example_url.html")
          } else {
          $.get( url, function(data) {
            window.open(url)
          }); }
          break;
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'date':
          output( new Date() );
          break;
        case 'run':
         if (args.includes('matrix.exe')) {
           window.setTimeout(theMatrix(), 1000);
         } else if (args.includes('rabbit.exe')) {
           output_.innerHTML = '';
           write(ascii(rabbit));
         } else if (args.includes('maze.exe')) {
           maze();
         } else if (args.includes('phone.exe')) {
           output('Operator, who do you want to call?')
           phoneIsOn = true
         } else {
           output( 'Sorry, couldn\'t find that program' );
           output('Usage: ' + cmd + ' object.exe');
           output('Example: ' + cmd + ' phone.exe');
         }
         break;
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
              output('the cubicle across from you is empty');
            } else if (playCount === 1){
              output('Stay here for just a moment');
              window.setTimeout(function() { write('go left') }, 3000);
            } else if (playCount === 2){
              output('When I tell you, go to the end of the row');
              window.setTimeout(function() { write('to your right') }, 3000);
            } else if (playCount === 3){
              output('to the end of the row')
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
    }

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
    window.setTimeout(function() { write('.') }, interval);
    window.setTimeout(function() { write('.') }, interval + 1000);
    window.setTimeout(function() { write('.') }, interval + 2000);
    window.setTimeout(function() { write('<br>') }, interval + 2000);
    window.setTimeout(function() { typeOut("Wake up Neo", 0, 150) }, interval + 5000);
    window.setTimeout(function() { typeOut("The Matrix has you", 0, 150) }, interval + 10000);
    window.setTimeout(function() { typeOut("Follow the White Rabbit", 0, 150) }, interval + 20000);
    matrixHasPlayed = true
  }

  function theClub(interval) {
    window.setTimeout(function() { typeOut("I know why you're here", 0, 150) }, interval + 5000);
    window.setTimeout(function() { typeOut("I know what you've been going through", 0, 150) }, interval + 10000);
    window.setTimeout(function() { typeOut("You're looking for it", 0, 150) }, interval + 20000);
  }
  //
  return {
    init: function() {
        window.setTimeout(function() {
          if (matrixHasPlayed === false) {
            theMatrix(1000);
        }}, 0001);
      },
    output: output
  }
  function maze() {
    output_.innerHTML = '';
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
    output_.innerHTML = '';
    pill();
  }

  function redpill() {
    $('.header').hide
    $('#container').hide
    var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
    canvas2 = document.getElementById( 'canvas2' ),
    ctx2 = ctx
		// full screen dimensions
		cw = window.innerWidth,
		ch = window.innerHeight,
    charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    maxCharCount = 100,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = cw/(fontSize);
    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;


    function randomInt( min, max ) {
    	return Math.floor(Math.random() * ( max - min ) + min);
    }

    function randomFloat( min, max ) {
    	return Math.random() * ( max - min ) + min;
    }

    function Point(x,y)
    {
      this.x = x;
      this.y = y;
    }

    Point.prototype.draw = function(ctx){

      this.value = charArr[randomInt(0,charArr.length-1)].toUpperCase();
      this.speed = randomFloat(1,5);


      ctx2.fillStyle = "rgba(255,255,255,0.8)";
      ctx2.font = fontSize+"px san-serif";
      ctx2.fillText(this.value,this.x,this.y);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize+"px san-serif";
        ctx.fillText(this.value,this.x,this.y);



        this.y += this.speed;
        if(this.y > ch)
        {
          this.y = randomFloat(-100,0);
          this.speed = randomFloat(2,5);
        }
    }

    for(var i = 0; i < maxColums ; i++) {
      fallingCharArr.push(new Point(i*fontSize,randomFloat(-500,0)));
    }


    var update = function()
    {

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,cw,ch);

    ctx2.clearRect(0,0,cw,ch);

      var i = fallingCharArr.length;

      while (i--) {
        fallingCharArr[i].draw(ctx);
        var v = fallingCharArr[i];
      }

      requestAnimationFrame(update);
    }
    window.setTimeout(function() {
      window.open("https://www.landingfestival.com")
    }, 7000);
  update();

  }

  function pill() {
    output("This is your last chance. After this, there is no turning back.")
    output("You take the blue pill - the story ends, you wake up in your bed and")
    output("believe whatever you want to believe. You take the red pill -")
    output("you stay in Wonderland and I show you how deep the rabbit-hole goes.")
    pillStage = true
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
              "        ,,,<%%uu\".a.=#u5uu%%%%" + "<br>" +
              "     ,;;;;;)#uu...,#/uuu%%%%%%%" + "<br>" +
              "       \\;;/####\\%mmmmmmmmmnu%%`%%;" + "<br>" +
              "      u####\"\"\"' (mmmmmmmmmmnu%%`%%%%" + "<br>" +
              "      uuu5E,..:;;#\\mmmmmmmnuu%;,`%%%%" + "<br>" +
              "       uuuu\\#####/uu,mmmmm5u%..;, :.%%%" + "<br>" +
              "          \\uuuuuuuuuuuuu,mnu/\\.;;  :..%%" + "<br>" +
              "            >##&&#######<%%%  \\;'   :.%%" + "<br>" +
              "         (###&&&#######%%%%%         :%'" + "<br>" +
              "       (###&&&&######(%%%%%%" + "<br>" +
              "      (#####&&&####(%%%%%%%%%" + "<br>" +
              "       (###########(%%%%%%0%%%%" + "<br>" +
              "      %%(###########(%%%%%%%%%%%%" + "<br>" +
              "     ;%%%(####6#####'%%%'%%%%%%%%%" + "<br>" +
              "    (%%%%; ;n####n'%%%%'n%%%%%%%%%%(@)" + "<br>" +
              "     \\%%%' %%nnnn'%%%%'nnnn%%%%%%%(@@@)" + "<br>" +
              "      ``' %%%nnnn``'nnnnnn%%%%%%%%(@@@@)" + "<br>" +
              "         ,%%%nnnnnnnnnnn%%%%%%9%%(@@@@@" + "<br>" +
              "  ,.,nnn%%%%nnnnn)nnnn%%%%%%%%%/  (@@)" + "<br>" +
              " (u(uuuuuuuuuuuuuu/ (u;;;;;;u)" + "<br>" +
              "                     (uuuuuuu)" + "<br>" +
              "                       ()0()" + "<br>";
