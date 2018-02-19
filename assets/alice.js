let where = "where"

function unloadJS() {
  let ary = document.getElementsByTagName('script');
  let len = ary.length;
  for (i = 0; i < len; i++) {
    ary[0].remove();
  }
}

$('#walk').on('click', function(ev){
  ev.preventDefault();
  let way = $('#direction').val()
  way = way.toLowerCase().replace(/[^a-z]/g, '');
  if (way === "idontmuchcarewhere") {
    window.location.replace(where + ".html")
  } else {
    $('#counter').text(parseInt($('#counter').text()) + 1)
  }
})

window.onload = function () {
  unloadJS()
};
