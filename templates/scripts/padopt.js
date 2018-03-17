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

window.addEventListener('load', start, false);

/**
 * Called once the page is loaded
 */
function start() {
  reviewMode();
}

/**
 * The review mode changes the default value of the input fields of the page
 * and disables the input fields (ie. the client cannot changes their value
 * anymore). The default values are read from the JSON passed to the page after
 * the hash in the URL
 */
function reviewMode() {

  // Prefix used by PW when transforming fields into inputfields
  const input_id_prefix = 'Inputfield_';

  // Get the default values from the URL
  var hash = window.location.hash.substr(1);

  if(hash) {

    // Default values are given as a JSON encoded in base64
    var options = JSON.parse(atob(hash));
    
    if(options) {
      for(var key in options) {

        // Step 1: Store values and keys in arrays
        var values = [];
        var ids = [];
  
        // Some values are composed of severeal values (eg. checkboxes) separated
        // by a pipe (eg. 1|2|3)
        if(options[key].toString().indexOf('|') > 0) {
          values = options[key].split('|');
  
          for(var i = 0; i < values.length; i++) {

            // When there are several inputs with the same name (and so several
            // values to select), the input ids integrate the value
            ids.push(key + '_' + values[i]);
          }
  
        } else {
          values.push(options[key]);
          ids.push(key);
        }
  
        // Step 2: Parse all ids and update values of the corresponding
        // input fields
        for(var i = 0; i < ids.length; i++) {
          var id = input_id_prefix + ids[i];
          var input = document.getElementById(id);
  
          if(input) {
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
