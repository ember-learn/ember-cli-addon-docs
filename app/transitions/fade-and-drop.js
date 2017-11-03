import { animate } from "liquid-fire";

export default function(opts={ duration: 100 }) {
  if (this.newElement) {
    this.newElement.css('margin-top', '-10px');
  }

  return animate(this.newElement, {
    opacity: 1,
    'margin-top': '0px'
  }, opts);
}
