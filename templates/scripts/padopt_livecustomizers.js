window.addEventListener('load', start, false);

function start() {
  locateLiveCustomizers();
  reviewMode();
}

function locateLiveCustomizers() {
  var livecustomizers = document.getElementsByClassName(padoptlc_classmaindiv);

  for(var i = 0; i < livecustomizers.length; i++) {
    var modifiers = livecustomizers[i].getElementsByTagName('select');

    for(var j = 0; j < modifiers.length; j++) {
      if(modifiers[j].getAttribute('name').startsWith(padoptlc_inputprefix)) {
        modifiers[j].addEventListener('change', changeModifier, false);
      }
    }
  }
}

function changeModifier() {
  var viewport_layer = document.getElementById(padoptlc_idprefix + this.name);

  var img_name_regex = new RegExp('^' + padoptlc_inputprefix, 'i');
  var img_name = this.name.replace(img_name_regex, '');

  viewport_layer.style.backgroundImage = 'url(' + padoptlc_imgurl + img_name.replace('_', '/') + '_' + this.value + '.png)';
}

function reviewMode() {
  const input_id_prefix = 'Inputfield_';
  var hash = window.location.hash.substr(1);

  if(hash) {
    var options = JSON.parse(atob(hash));
    
    if(options) {
      for(var key in options) {
        var values = [];
        var ids = [];
  
        if(options[key].toString().indexOf('|') > 0) {
          values = options[key].split('|');
  
          for(var i = 0; i < values.length; i++) {
            ids.push(key + '_' + values[i]);
          }
  
        } else {
          values.push(options[key]);
          ids.push(key);
        }
  
        for(var i = 0; i < ids.length; i++) {
          var id = input_id_prefix + ids[i];
          var input = document.getElementById(id);
  
          if(input) {
            if(input.type == 'checkbox') {
              input.checked = true;
  
            } else {
              input.value = values[i];
            }
  
            input.dispatchEvent(new Event('change'));
          }
        }
      }

      var form = document.getElementsByClassName('padloper-cart-add-product');

      if(form) {
        form = form[0];
        var input_types = [ 'input', 'select' ];

        for(var i = 0; i < input_types.length; i++) {
          var inputs = form.getElementsByTagName(input_types[i]);
      
          for(var j = 0; j < inputs.length; j++) {
            inputs[j].readonly = true;
            inputs[j].disabled = true;
          }
        }
      }
    }
  }
}
