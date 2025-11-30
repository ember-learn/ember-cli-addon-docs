/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to kebab-case (dasherized)
 * @param {string} str - The string to dasherize
 * @returns {string} The dasherized string
 */
export function dasherize(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  return str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2') // Add dash between camelCase
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1-$2') // Handle consecutive capitals
    .replace(/[ _]/g, '-') // Replace spaces and underscores with dashes
    .toLowerCase();
}

/**
 * Converts a string to PascalCase (classified)
 * @param {string} str - The string to classify
 * @returns {string} The classified string
 */
export function classify(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }

  // If the string contains separators (spaces, dashes, underscores), split and classify
  if (/[\s_-]/.test(str)) {
    return str
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  // Otherwise, just capitalize the first letter (preserve camelCase like innerHTML -> InnerHTML)
  return str.charAt(0).toUpperCase() + str.slice(1);
}
