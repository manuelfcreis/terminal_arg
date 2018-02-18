// Initial variables
let phoneIsOn = false
let matrixHasPlayed = false
let playCount = 0
let playArray = [false, false, false, false]
let pillStage = false
let time_ = Date.now()
let hardMode = false

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
  let MAZECMDS_ = ['look', 'forward', 'left', 'right'];

  let CMDS_ = [
    'open', 'clear', 'date', 'run', 'help', 'uname'
  ];

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
        cmd = cmd.replace(/\D/, '')
        switch (cmd) {
          case '5350690':
            phoneIsOn = false
            maze()
            break;
          default:
            output('Phone numbers should be ###-####!')
            phoneIsOn = false
            break;
          };
      } else if (pillStage) {
        if (cmd.match(/blue/)) {
          location.reload();
        } else if (cmd.match(/red/)) {
          redpill();
        } else {
          write("red or blue there is no other choice")
        }
      } else {
      switch (cmd) {
        case 'open':
          var url = args.join(' ');
          if (!url) {
            output('Usage: ' + cmd + ' website...');
            output('Example: ' + cmd + ' http://www.followthewhiterabbit.tech/rabbit.html');
            break;
          } else if (url.match(/followthewhiterabbit.tech\/rabbit/)) {
            window.open("rabbit.html")
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
           theClub(0);
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
          if (mazeStage){
            output('<div class="ls-files">' + MAZECMDS_.join('<br>') + '</div>')
          } else {
            output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          }
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
            if (playCount === 0 || playCount === 3) {
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

  // Particle effect from
  var particleAlphabet = {
    stop: function() {
      ctx=null;
    },

  	Particle: function(x, y) {
  		this.x = x;
  		this.y = y;
  		this.radius = 3.5;
  		this.draw = function(ctx) {
  			ctx.save();
  			ctx.translate(this.x, this.y);
  			ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, this.radius, this.radius);
  			ctx.restore();
  		};
  	},
  	init: function() {
  		particleAlphabet.canvas = document.getElementById('number');
  		particleAlphabet.ctx = particleAlphabet.canvas.getContext('2d');
  		particleAlphabet.W = window.innerWidth;
  		particleAlphabet.H = window.innerHeight;
  		particleAlphabet.particlePositions = [];
  		particleAlphabet.particles = [];
  		particleAlphabet.tmpCanvas = document.createElement('canvas');
  		particleAlphabet.tmpCtx = particleAlphabet.tmpCanvas.getContext('2d');

  		particleAlphabet.canvas.width = particleAlphabet.W;
  		particleAlphabet.canvas.height = particleAlphabet.H;

  		setInterval(function(){
  			particleAlphabet.changeLetter();
  			particleAlphabet.getPixels(particleAlphabet.tmpCanvas, particleAlphabet.tmpCtx);
  		}, 1200);

  		particleAlphabet.makeParticles(1000);
  		particleAlphabet.animate();
  	},
  	currentPos: 0,
  	changeLetter: function() {
  		var letters = '535-0690 535-0690 ',
  			letters = letters.split('');
  		particleAlphabet.time = letters[particleAlphabet.currentPos];
  		particleAlphabet.currentPos++;
  		if (particleAlphabet.currentPos == letters.length + 1) {
  			document.getElementById('number').remove();
  		}

  	},

  	makeParticles: function(num) {
  		for (var i = 0; i <= num; i++) {
  			particleAlphabet.particles.push(new particleAlphabet.Particle(particleAlphabet.W / 2 + Math.random() * 400 - 200, particleAlphabet.H / 2 + Math.random() * 400 -200));
  		}
  	},

  	getPixels: function(canvas, ctx) {
  		var keyword = particleAlphabet.time,
  			gridX = 6,
  			gridY = 6;
  		canvas.width = window.innerWidth;
  		canvas.height = window.innerHeight;
  		ctx.fillStyle = 'red';
  		ctx.font = 'italic bold 330px Noto Serif';
  		ctx.fillText(keyword, canvas.width / 2 - ctx.measureText(keyword).width / 2, canvas.height / 2 + 100);
  		var idata = ctx.getImageData(0, 0, canvas.width, canvas.height);
  		var buffer32 = new Uint32Array(idata.data.buffer);
  		if (particleAlphabet.particlePositions.length > 0) particleAlphabet.particlePositions = [];
  		for (var y = 0; y < canvas.height; y += gridY) {
  			for (var x = 0; x < canvas.width; x += gridX) {
  				if (buffer32[y * canvas.width + x]) {
  					particleAlphabet.particlePositions.push({x: x, y: y});
  				}
  			}
  		}
  	},
  	animateParticles: function() {
  		var p, pPos;
  		for (var i = 0, num = particleAlphabet.particles.length; i < num; i++) {
  			p = particleAlphabet.particles[i];
  			pPos = particleAlphabet.particlePositions[i];
  			if (particleAlphabet.particles.indexOf(p) === particleAlphabet.particlePositions.indexOf(pPos)) {
  			p.x += (pPos.x - p.x) * .3;
  			p.y += (pPos.y - p.y) * .3;
  			p.draw(particleAlphabet.ctx);
  		}
  		}
  	},
  	animate: function() {
  		requestAnimationFrame(particleAlphabet.animate);
  		particleAlphabet.ctx.fillStyle = 'rgba(0,0,0, .8)';
  		particleAlphabet.ctx.fillRect(0, 0, particleAlphabet.W, particleAlphabet.H);
  		particleAlphabet.animateParticles();
  	}
  };

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
    window.setTimeout(function() { typeOut("Wake up Neo", 0, 150) }, interval);
    window.setTimeout(function() { typeOut("The Matrix has you", 0, 150) }, interval + 3000);
    window.setTimeout(function() { typeOut("Follow the White Rabbit", 0, 150) }, interval + 6000);
    matrixHasPlayed = true
  }

  function theClub(interval) {
    window.setTimeout(function() { typeOut("I know why you're here", 0, 150) }, interval);
    window.setTimeout(function() { typeOut("I know what you've been going through", 0, 100) }, interval + 4000);
    window.setTimeout(function() { typeOut("You're looking for it", 0, 100) }, interval + 10000);
    window.setTimeout(function() { output_.innerHTML = '' }, interval + 15000);
    window.setTimeout(function() { particleAlphabet.init() }, interval + 15500);
    window.setTimeout(function() { particleAlphabet.stop() }, interval + 25000);
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
    let playCount = 0;
    let playArray = [false, false, false, false];
    mazeStage = true;
    write(ascii(mazeScreen));
    write("<br> You're in a maze of cubicles")
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
    output_.innerHTML = '';
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
    time_ = (Date.now() - time_);
    var minutes = Math.floor(time_ / 60000);
    var seconds = ((time_ % 60000) / 1000).toFixed(0);
    console.log(minutes)
    console.log(seconds)
    console.log(time_)

    window.setTimeout(function() {
      write('<p><strong>Fasten your seat belt Dorothy, ’cause Kansas is going bye-bye.</strong></p>')
      write('Congratulations on completing the terminal in ' + minutes + ' minutes and ' + seconds + ' seconds.<br>')
      write('You just won a <strong>Discount Code</strong> to the Landing Festival! Want to see how deep the rabbit hole goes?<br>')
      write('Just go to <strong><a href="https://landingfestival.com/berlin/tickets" target="_blank">https://landingfestival.com</a></strong> and claim your ticket<br>')
      write('You can use the promo code - LFB18-WhiteRabbit - for a <strong>free Access Pass</strong><br>')
      write('Or the code - LFB18-RedPill - for 50% off your <strong>Premium Pass</strong><br>')
    }, 3000);
    window.setTimeout(function() {
      window.open("https://www.landingfestival.com")
    }, 12000);
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
