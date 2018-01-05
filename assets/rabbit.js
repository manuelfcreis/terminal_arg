
function whiteRabbit() {
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
               "                       ()()()" + "<br>"
        write(ascii(rabbit));
        }

// Matrix Functions

function theMatrix() {
  write('.')
  window.setTimeout(function() { write('.') }, 3000);
  window.setTimeout(function() { write('.') }, 6000);
  window.setTimeout(function() { write('<br>') }, 6000);
  window.setTimeout(function() { typeOut("Wake up Neo", 0, 350) }, 9000);
  window.setTimeout(function() { typeOut("The Matrix has you", 0, 350) }, 15500);
  window.setTimeout(function() { typeOut("Follow the White Rabbit", 0, 350) }, 25500);
  matrixHasPlayed = true
}
