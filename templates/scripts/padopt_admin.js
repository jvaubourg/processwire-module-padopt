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

window.addEventListener('load', startPadoptAdmin, false);

/**
 * Called once the page is loaded
 */
function startPadoptAdmin() {
  padoptAdminShowListButtons();
}

/**
 * Error logging
 *
 * @param string $msg
 */
function padoptAdminLogError(msg) {
  console.log(padopt_logname + ': ' + msg);
}

/**
 * Add click action to every "Show Options" link
 */
function padoptAdminShowListButtons() {
  var buttons = document.getElementsByClassName('padopt_show_options');

  for(var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', padoptAdminShowList, false);
  }
}

/**
 * Show options list when a "Show Options" link is clicked
 */
function padoptAdminShowList() {
  $(this).next().slideToggle();
}
