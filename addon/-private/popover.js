/**
  Turns an element into an anchored, non-modal popover using the browser's
  Popover API (for top-layer rendering) and CSS anchor positioning (for
  placement relative to an anchor element).

  The element must carry a `popover="manual"` attribute and the `docs-popover`
  class (see `addon/styles/components/_docs-popover.scss`). Placement is
  driven by CSS via the `data-docs-placement` attribute set here.

  Browsers that support the Popover API but not CSS anchor positioning
  (Safari 17/18, Firefox < 147) fall back to positioning the popover with
  inline `top`/`left`/`right` styles computed from the anchor's bounding box.

  @param {HTMLElement} element the popover element
  @param {Object} options
  @param {string|Element} options.anchor the element (or selector) the popover is positioned against
  @param {string|Element} [options.trigger=options.anchor] element (or selector) whose clicks never count as "outside"
  @param {'bottom-start'|'bottom-end'} [options.placement='bottom-start'] which edges to align
  @param {Function} [options.onClose] called when the user clicks outside or presses Escape
  @return {Function} a teardown function
  @private
*/
export function openAnchoredPopover(
  element,
  { anchor, trigger = anchor, placement = 'bottom-start', onClose } = {},
) {
  let anchorElement = resolve(anchor);
  let triggerElement = resolve(trigger) || anchorElement;
  let teardowns = [];

  element.dataset.docsPlacement = placement;

  if (anchorElement) {
    if (supportsAnchorPositioning()) {
      teardowns.push(linkAnchor(element, anchorElement));
    } else {
      teardowns.push(positionManually(element, anchorElement, placement));
    }
  }

  if (typeof element.showPopover === 'function') {
    element.showPopover();
    teardowns.push(() => {
      if (element.isConnected && element.matches(':popover-open')) {
        element.hidePopover();
      }
    });
  }

  if (onClose) {
    let onPointerDown = (event) => {
      let { target } = event;
      let isInside =
        element.contains(target) ||
        anchorElement?.contains(target) ||
        triggerElement?.contains(target);

      if (!isInside) {
        onClose();
      }
    };
    let onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    teardowns.push(() => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    });
  }

  return () => {
    teardowns.reverse().forEach((teardown) => teardown());
    teardowns = [];
  };
}

function resolve(elementOrSelector) {
  if (typeof elementOrSelector === 'string') {
    return document.querySelector(elementOrSelector);
  }
  return elementOrSelector || null;
}

export function supportsAnchorPositioning() {
  return (
    typeof CSS !== 'undefined' &&
    CSS.supports?.('position-anchor', '--docs-popover') &&
    CSS.supports?.('position-area', 'bottom')
  );
}

let anchorCounter = 0;

// Associates the popover with its anchor through CSS anchor positioning. The
// actual placement (`position-area`) lives in the stylesheet.
function linkAnchor(element, anchorElement) {
  let name = anchorElement.style.anchorName;
  let ownsName = false;

  if (!name || name === 'none') {
    name = `--docs-popover-anchor-${anchorCounter++}`;
    anchorElement.style.anchorName = name;
    ownsName = true;
  }

  element.style.positionAnchor = name;

  return () => {
    element.style.positionAnchor = '';
    if (ownsName) {
      anchorElement.style.anchorName = '';
    }
  };
}

// Fallback for browsers without CSS anchor positioning: mirror the anchor's
// bounding box into inline styles, and keep them fresh on scroll and resize.
function positionManually(element, anchorElement, placement) {
  let viewportGap = 8;

  let update = () => {
    let anchorRect = anchorElement.getBoundingClientRect();
    let { innerWidth, innerHeight } = window;

    element.style.top = `${anchorRect.bottom}px`;
    element.style.bottom = 'auto';
    element.style.maxHeight = `${Math.max(0, innerHeight - anchorRect.bottom - viewportGap)}px`;

    if (placement === 'bottom-end') {
      let right = Math.max(0, innerWidth - anchorRect.right);
      element.style.right = `${Math.min(right, Math.max(0, innerWidth - element.offsetWidth))}px`;
      element.style.left = 'auto';
    } else {
      let left = Math.max(0, anchorRect.left);
      element.style.left = `${Math.min(left, Math.max(0, innerWidth - element.offsetWidth))}px`;
      element.style.right = 'auto';
    }
  };

  update();
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, true);

  return () => {
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update, true);
    ['top', 'bottom', 'left', 'right', 'maxHeight'].forEach((property) => {
      element.style[property] = '';
    });
  };
}
