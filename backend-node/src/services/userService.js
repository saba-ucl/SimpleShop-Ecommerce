// Business logic for users (same rules as UserService.java).
//
// Like the Java version, passwords are stored and compared as plain text
// to keep the demo simple. A real application must hash passwords.

import { userRepository } from '../repositories/userRepository.js';
import { badRequest } from '../http/httpUtils.js';
import { validate, notBlank, email } from '../http/validation.js';

export const userService = {
  getAll() {
    return userRepository.findAll();
  },

  register(input) {
    validate(input, { name: [notBlank], email: [notBlank, email], password: [notBlank] });
    if (userRepository.existsByEmailIgnoreCase(input.email)) {
      throw badRequest('Email is already registered.');
    }
    // New registrations are always normal users, never admins.
    return userRepository.insert({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      role: 'USER'
    });
  },

  login(input) {
    validate(input, { email: [notBlank, email], password: [notBlank] });
    const user = userRepository.findByEmailIgnoreCaseWithPassword(input.email);
    if (!user || user.password !== input.password) {
      throw badRequest('Invalid email or password.');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
