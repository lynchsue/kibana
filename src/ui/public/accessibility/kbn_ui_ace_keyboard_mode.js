/**
 * The `kbn-ui-ace-keyboard-mode` directive should be used on any element, that
 * `ui-ace` is used on. It will prevent the keyboard trap, that ui-ace usually
 * has, i.e. tabbing into the box won't give you any possibilities to leave
 * it via keyboard again, since tab inside the textbox works like a tab character.
 *
 * This directive won't change anything, if the user uses the mouse. But if she
 * tabs to the ace editor, an overlay will be shown, that you have to press Enter
 * to enter editing mode, and that it can be left by pressing Escape again.
 *
 * That way the ui-ace editor won't trap keyboard focus, and won't cause that
 * accessibility issue anymore.
 */

import angular from 'angular';
import { uiModules } from 'ui/modules';
import './kbn_ui_ace_keyboard_mode.less';
import { ESC_KEY_CODE, ENTER_KEY } from 'ui_framework/services';

let aceKeyboardModeId = 0;

uiModules.get('kibana').directive('kbnUiAceKeyboardMode', () => ({
  restrict: 'A',
  link(scope, element) {
    const uniqueId = `uiAceKeyboardHint-${scope.$id}-${aceKeyboardModeId++}`;

    const hint = angular.element(
      `<div
        class="uiAceKeyboardHint"
        id="${uniqueId}"
        tabindex="0"
        role="application"
      >
        <p class="kuiText kuiVerticalRhythmSmall">
          Press Enter to start editing.
        </p>
        <p class="kuiText kuiVerticalRhythmSmall">
          When you&rsquo;re done, press Escape to stop editing.
        </p>
      </div>
    `);

    const uiAceTextbox = element.find('textarea');

    function startEditing() {
      // We are not using ng-class in the element, so that we won't need to $compile it
      hint.addClass('uiAceKeyboardHint-isInactive');
      uiAceTextbox.focus();
    }

    function enableOverlay() {
      hint.removeClass('uiAceKeyboardHint-isInactive');
    }

    hint.keydown((ev) => {
      if (ev.keyCode === ENTER_KEY) {
        ev.preventDefault();
        startEditing();
      }
    });

    uiAceTextbox.blur(() => {
      enableOverlay();
    });

    uiAceTextbox.keydown((ev) => {
      if (ev.keyCode === ESC_KEY_CODE) {
        ev.preventDefault();
        ev.stopPropagation();
        enableOverlay();
        hint.focus();
      }
    });

    hint.click(startEditing);
    // Prevent tabbing into the ACE textarea, we now handle all focusing for it
    uiAceTextbox.attr('tabindex', '-1');
    element.prepend(hint);
  }
}));
