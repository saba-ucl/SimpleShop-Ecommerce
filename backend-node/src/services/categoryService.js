// Business logic for categories (same rules as CategoryService.java).

import { categoryRepository } from '../repositories/categoryRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { badRequest } from '../http/httpUtils.js';
import { validate, notBlank } from '../http/validation.js';

const categoryRules = { name: [notBlank] };

export const categoryService = {
  getAll() {
    return categoryRepository.findAll();
  },

  getById(id) {
    const category = categoryRepository.findById(id);
    if (!category) {
      throw badRequest(`Category not found with id: ${id}`);
    }
    return category;
  },

  create(input) {
    validate(input, categoryRules);
    if (categoryRepository.existsByNameIgnoreCase(input.name)) {
      throw badRequest('Category name already exists.');
    }
    return categoryRepository.insert(input);
  },

  update(id, input) {
    validate(input, categoryRules);
    const category = this.getById(id);
    const nameTaken = input.name.toLowerCase() !== category.name.toLowerCase() &&
      categoryRepository.existsByNameIgnoreCase(input.name);
    if (nameTaken) {
      throw badRequest('Category name already exists.');
    }
    return categoryRepository.update(id, input);
  },

  delete(id) {
    if (productRepository.existsByCategoryId(id)) {
      throw badRequest('Cannot delete a category that still has products.');
    }
    this.getById(id);
    categoryRepository.delete(id);
  }
};
