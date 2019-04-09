const TAGNAMES_THAT_WHEN_FOCUSED_PREVENT_KEYBOARD_SHORTCUTS = [ 'INPUT', 'SELECT', 'TEXTAREA' ];

/**
  @function formElementHasFocus
  @hide
*/
export function formElementHasFocus() {
  return TAGNAMES_THAT_WHEN_FOCUSED_PREVENT_KEYBOARD_SHORTCUTS.includes(document.activeElement.tagName);
}
