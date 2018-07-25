/* PadOpt for PadLoper
 * Add custom client options feature to PadLoper (ProcessWire module) 
 *
 * Copyright (C) 2018 Julien Vaubourg <julien@vaubourg.com>
 * Contribute at https://github.com/jvaubourg/processwire-module-padopt
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

window.addEventListener('load', startPadoptProduct, false);

/**
 * Called once the page is loaded
 */
function startPadoptProduct() {
  padoptProductReviewMode();

  var forms = document.getElementsByClassName('padloper-cart-add-product');

  if(forms.length > 0) {
    forms[0].addEventListener('submit', padoptProductAdd, false);
  }
}

/**
 * Error logging
 *
 * @param string $msg
 */
function padoptProductLogError(msg) {
  console.log(padopt_logname + ': ' + msg);
}

/**
 * Called when the "Add to cart" form is submitted
 *
 * @param Event e
 * @return bool From has required fields not filled or not
 */
function padoptProductAdd(e) {
  if(padoptProductCheckRequiredFields()) {
    this.submit();
    return true;
  }

  e.preventDefault();

  return false;
}

/**
 * Check if all required fields are filled or not
 *
 * @return bool
 */
function padoptProductCheckRequiredFields() {
  var not_filled = 0;
  var required_fields = document.getElementsByClassName('required');

  for(var i = 0; i < required_fields.length; i++) {
    required_fields[i].className = required_fields[i].className.replace(/\s*padopt_required\s*/, '');

    // A select field with a choice marked as prompt is considered not filled, as an empty value
    if(required_fields[i].value == '' || (required_fields[i].tagName.match(/select/i) && required_fields[i].options[required_fields[i].selectedIndex].getAttribute('data-isprompt') == 1)) {
      required_fields[i].className += ' padopt_required';
      not_filled++;
    }
  }

  if(not_filled > 0) {
    $('#padopt_error').slideDown('slow', function() {
      $('#padopt_error').fadeIn(200);
      $('#padopt_error').fadeOut(100);
      $('#padopt_error').fadeIn(1000);
    });

    return false;
  }

  $('#padopt_error').hide();

  return true;
}

/**
 * The review mode changes the default value of the input fields of the page
 * and disables the input fields (ie. the client cannot changes their value
 * anymore). The default values are read from the JSON passed to the page after
 * the hash in the URL
 */
function padoptProductReviewMode() {

  // Prefix used by PW when transforming fields into inputfields
  const input_id_prefix = 'Inputfield_';

  // Get the default values from the URL
  var hash = window.location.hash.substr(1);

  if(hash) {

    // Default values are given as a JSON encoded in base64
    var options = JSON.parse(atob(hash));
    
    if(options) {
      for(var key in options) {
        if(key != 'product_id') {

          // Step 1: Store values and keys in arrays
          var values = [];
          var ids = [];
  
          // Some values are composed of multiple values (eg. checkboxes) separated
          // by a pipe (eg. 1|2|3)
          if(options[key].toString().indexOf('|') > 0) {
            var subvalues = options[key].split('|');
  
            for(var i = 0; i < subvalues.length; i++) {
              if(/^[0-9]$/.test(subvalues[i])) {
                // When there are several inputs with the same name (and so several
                // values to select), the input ids integrate the value
                var id = input_id_prefix + key + '_' + subvalues[i];

                if(document.getElementById(id)) {
                  ids.push(id);
                  values.push(1);

                } else {
                  padoptProductLogError("Input field " + id + " not found");
                }

              } else {
                padoptProductLogError("Input field " + id + " subvalues must be numbers: " + subvalues[i]);
              }
            }
  
          } else {
            var id = input_id_prefix + key;
            var value = options[key];

            if(document.getElementById(id)) {
              ids.push(id);
              values.push(value);

            } else if(/^[0-9]$/.test(value)) {
              var alt_id = id + '_' + value;

              if(document.getElementById(alt_id)) {
                ids.push(alt_id);
                values.push(value);

              } else {
                padoptProductLogError("Input field " + id + " (or " + alt_id + ") not found");
              }
            } else {
              padoptProductLogError("Input field " + id + " not found");
            }
          }
  
          // Step 2: Parse all ids and update values of the corresponding
          // input fields
          for(var i = 0; i < ids.length; i++) {
            var input = document.getElementById(ids[i]);
  
            if(input.type == 'checkbox') {
              input.checked = true;
  
            } else {
              input.value = values[i];
            }
  
            // Ask the input fields to trigger their 'change' handlers
            input.dispatchEvent(new Event('change'));
          }
        }
      }

      var form = document.getElementsByClassName('padloper-cart-add-product');

      // Disable all the input fields of the PadLoper form
      if(form) {
        form = form[0];
        var input_types = [ 'input', 'textarea', 'select' ];

        for(var i = 0; i < input_types.length; i++) {
          var inputs = form.getElementsByTagName(input_types[i]);
      
          for(var j = 0; j < inputs.length; j++) {
            inputs[j].readonly = true;
            inputs[j].disabled = true;

            // Hide 'Add to Cart' buttons
            if(input_types[i] == 'input' && inputs[j].getAttribute('type') == 'submit') {
              inputs[j].style.display = 'none';
            }
          }
        }
      }
    }
  }
}
