// Input validation, the Node version of the Java annotations
// @NotBlank, @NotNull, @Email, @Min and so on.
//
// Each rule returns an error text, or null when the value is fine.
// The error texts are the same as the Java backend's, so the frontend
// shows the same messages, e.g. "email: must be a well-formed email address".

import { badRequest } from './httpUtils.js';

const isMissing = (value) => value === undefined || value === null;

export const notBlank = (value) =>
  typeof value !== 'string' || value.trim() === '' ? 'must not be blank' : null;

export const notNull = (value) =>
  isMissing(value) ? 'must not be null' : null;

export const email = (value) =>
  !isMissing(value) && (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+$/.test(value))
    ? 'must be a well-formed email address'
    : null;

export const min = (limit) => (value) =>
  !isMissing(value) && !(Number(value) >= limit)
    ? `must be greater than or equal to ${limit}`
    : null;

export const wholeNumber = (value) =>
  !isMissing(value) && !Number.isInteger(value) ? 'must be a whole number' : null;

export const number = (value) =>
  !isMissing(value) && (typeof value !== 'number' || !Number.isFinite(value)) ? 'must be a number' : null;

export const notEmptyList = (value) =>
  !Array.isArray(value) || value.length === 0 ? 'must not be empty' : null;

// Checks `data` against `rules` and throws a 400 error on the first problem.
//
// Example:
//   validate(body, { name: [notBlank], price: [notNull, number, min(0)] });
export function validate(data, rules, prefix = '') {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw badRequest('Request body must be a JSON object.');
  }
  for (const [field, checks] of Object.entries(rules)) {
    for (const check of checks) {
      const problem = check(data[field]);
      if (problem) {
        throw badRequest(`${prefix}${field}: ${problem}`);
      }
    }
  }
}
