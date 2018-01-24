window.addEventListener('load', start, false);

function start() {
  locateConfigurators(); 
}

function locateConfigurators() {
  var configurators = document.getElementsByClassName(padoptconf_classmaindiv);

  for(var i = 0; i < configurators.length; i++) {
    var modifiers = configurators[i].getElementsByTagName('select');

    for(var j = 0; j < modifiers.length; j++) {
      if(modifiers[j].getAttribute('name').startsWith(padoptconf_inputprefix)) {
        modifiers[j].addEventListener('change', changeModifier, false);
      }
    }
  }
}

function changeModifier() {
  var viewport_layer = document.getElementById(padoptconf_idprefix + this.name);
  viewport_layer.style.backgroundImage = 'url(' + padoptconf_imgurl + this.name + '_' + this.value + '.png)';
}
