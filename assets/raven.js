function unloadJS() {
  let ary = document.getElementsByTagName('script');
  let len = ary.length;
  for (i = 0; i < len; i++) {
    ary[0].remove();
  }
}

$('.rvn-button').on('click', function(ev){
  ev.preventDefault()
  let one = $('#one').val()
  let two = $('#two').val()
  let three = $('#three').val()
  let four = $('#four').val()
  let five = $('#five').val()
  let six = $('#six').val()
  let seven = $('#seven').val()
  let eight = $('#eight').val()
  window.location.replace(`${one}${two}${three}${four}${five}${six}${seven}${eight}.html`)
})

window.onload = function () {
  unloadJS()
};
