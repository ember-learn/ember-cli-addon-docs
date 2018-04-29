/** @documenter esdoc */

/**
 * A first-class greeting for the people.
 *
 * @type {string}
 */
export const GREETING = 'Hello';

/**
 * Greet whoever you like!
 *
 * @param {string} subject The target of your greeting
 * @return {string} A hand-crafted artisanal greeting just for your subject
 */
export function greet(subject = 'World') {
  return `${GREETING}, ${subject}!`;
}
