window.addEventListener('load', start, false);

function start() {
  showListButtons();
}

function showListButtons() {
  var buttons = document.getElementsByClassName('padopt_show_options');

  for(var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', showList, false);
  }
}

function showList() {
  $(this).next().slideToggle();
}
