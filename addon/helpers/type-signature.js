import { assert } from '@ember/debug';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

function escape(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function functionSignature({ name, params, returns }) {
  let paramSignature = params.filter(p => !p.name.includes('.')).map(({ name, type }) => {
    return [`<strong>${name}</strong>`, `<em>${type}</em>`].join(': ');
  }).join(', ')

  let returnType = returns ? returns.type : 'any';

  return `<strong>${name}</strong>(${paramSignature}): <em>${returnType}</em>`;
}

function accessorSignature({ name, type, hasGetter, hasSetter }) {
  let accessorPrefixes = [hasGetter && 'get', hasSetter && 'set'].filter(a => a).join('/');

  assert(`accessors must have either a getter or setter, but '${name}' had neither`, accessorPrefixes);

  return `${accessorPrefixes} ${variableSignature({ name, type })}`;
}

function variableSignature({ name, type }) {
  return `<strong>${name}:</strong> <em>${escape(type)}</em>`;
}

/**
  @function typeSignature
  @hide
*/
export function typeSignature([typed]) {
  let signature;

  if ('hasGetter' in typed || 'hasSetter' in typed) {
    signature = accessorSignature(typed);
  } else if ('type' in typed) {
    signature = variableSignature(typed);
  } else {
    signature = functionSignature(typed);
  }

  if (typed.isStatic) {
    signature = `static ${signature}`;
  }

  if (typed.access === 'private' || typed.access === 'protected') {
    signature = `${typed.access} ${signature}`;
  }

  return htmlSafe(signature);
}

export default helper(typeSignature);
