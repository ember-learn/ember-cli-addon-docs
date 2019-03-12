import { assert } from '@ember/debug';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

function escape(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function functionSignature(fn) {
  // Functions may have { params, typeParams, returns } directly on them, or they
  // may have a `signatures` array of hashes each with those properties.
  let signatures = (fn.signatures || [fn]).map(({ params, typeParams, returns }) => {
    let paramSignature = params.filter(p => !p.name.includes('.')).map(({ name, type, isRest, isOptional }) => {
      let prefix = isRest ? '...' : '';
      let suffix = isOptional ? '?' : '';
      return `${prefix}<strong>${name}</strong>${suffix}: <em>${type}</em>`;
    }).join(', ');

    let typeParamSignature = '';
    if (typeParams && typeParams.length) {
      typeParamSignature = `&lt;${typeParams.map(p => `<em>${p}</em>`).join(', ')}&gt;`;
    }

    let returnType = returns ? returns.type : 'any';

    return `<strong>${fn.name}</strong>${typeParamSignature}(${paramSignature}): <em>${returnType}</em>`;
  });

  return signatures.join('<br>');
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
