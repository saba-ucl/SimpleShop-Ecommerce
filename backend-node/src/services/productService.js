// Business logic for products (same rules as ProductService.java).

import { productRepository } from '../repositories/productRepository.js';
import { categoryRepository } from '../repositories/categoryRepository.js';
import { badRequest } from '../http/httpUtils.js';
import { validate, notBlank, notNull, number, wholeNumber, min } from '../http/validation.js';

// Same rules as ProductRequest.java
const productRules = {
  name: [notBlank],
  price: [notNull, number, min(0.0)],
  stock: [notNull, wholeNumber, min(0)],
  categoryId: [notNull, wholeNumber]
};

function checkCategoryExists(categoryId) {
  if (!categoryRepository.findById(categoryId)) {
    throw badRequest('Category not found.');
  }
}

export const productService = {
  getAll(keyword, categoryId) {
    if (keyword && keyword.trim() !== '') {
      return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    if (categoryId) {
      return productRepository.findByCategoryId(categoryId);
    }
    return productRepository.findAll();
  },

  getById(id) {
    const product = productRepository.findById(id);
    if (!product) {
      throw badRequest(`Product not found with id: ${id}`);
    }
    return product;
  },

  create(input) {
    validate(input, productRules);
    checkCategoryExists(input.categoryId);
    return productRepository.insert(input);
  },

  update(id, input) {
    validate(input, productRules);
    this.getById(id);
    checkCategoryExists(input.categoryId);
    return productRepository.update(id, input);
  },

  delete(id) {
    this.getById(id);
    productRepository.delete(id);
  }
};
