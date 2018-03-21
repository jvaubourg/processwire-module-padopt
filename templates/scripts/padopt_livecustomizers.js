/* PadOptLiveCustomizers (PadOpt submodule)
 * Add live customization of products feature to PadOpt (ProcessWire module) 
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
  locateLiveCustomizers();
}

/*
 * Find viewports of live customizers and ask the input fields to call
 * changeModifier when their value is changed by the client
 */
function locateLiveCustomizers() {
  var livecustomizers = document.getElementsByClassName(padoptlc_classmaindiv);

  for(var i = 0; i < livecustomizers.length; i++) {
    var modifiers = livecustomizers[i].getElementsByTagName('select');

    for(var j = 0; j < modifiers.length; j++) {
      if(modifiers[j].getAttribute('name').startsWith(padoptlc_inputprefix)) {
        modifiers[j].addEventListener('change', changeModifier, false);

        // Preview mode enabled
        if(modifiers[j].disabled) {
          modifiers[j].disabled = false;
          modifiers[j].dispatchEvent(new Event('change'));
          modifiers[j].disabled = true;
        }
      }
    }
  }
}

/**
 * Called every time the value of an input field is changed inside a viewport.
 * Update the corresponding viewport by loading a different background image
 * for the layer corresponding to this option
 */
function changeModifier() {

  // Viewports are composed of as many layers as there are fields
  // Updating an option value means updating the background image of the corresponding layer
  var viewport_layer = document.getElementById(padoptlc_idprefix + this.name);

  // Remove the prefix from the input field name, to keep only the name of
  // the option
  var img_name_regex = new RegExp('^' + padoptlc_inputprefix, 'i');
  var img_name = this.name.replace(img_name_regex, '');

  // The background image to show should have a name with a
  // <option-name>_<value-chosen>.png format
  viewport_layer.style.backgroundImage = 'url(' + padoptlc_imgurl + img_name.replace('_', '/') + '_' + this.value + '.png)';
}
