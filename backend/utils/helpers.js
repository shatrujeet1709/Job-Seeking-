/**
 * Escapes special RegExp characters from user input to prevent ReDoS attacks.
 * @param {string} str — raw user input
 * @returns {string} — escaped string safe for new RegExp()
 */
function escapeRegex(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { escapeRegex };
