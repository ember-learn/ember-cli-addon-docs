import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

function functionSignature({ name, params, returns }) {
  let paramSignature = params.filter(p => !p.name.includes('.')).map(({ name, type }) => {
    return [`<strong>${name}</strong>`, `<em>${type}</em>`].join(': ');
  }).join(', ')

  let returnType = returns ? returns.type : 'any';

  return htmlSafe(`<strong>${name}</strong>(${paramSignature}): <em>${returnType}</em>`);
}

function variableSignature({ name, type }) {
  return htmlSafe(`<strong>${name}:</strong> <em>${type}</em>`);
}


export function typeSignature([typed]) {
  if (
    typed.type === 'function'
    || typed.type === 'method'
    || typed.type === 'helper'
  ) {
    return functionSignature(typed);
  }

  return variableSignature(typed);
}

export default helper(typeSignature);
