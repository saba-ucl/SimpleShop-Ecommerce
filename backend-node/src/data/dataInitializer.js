// Fills the empty database with sample data on startup
// (same as backend/.../config/DataInitializer.java).

import { db, transaction } from '../db/database.js';
import { categories, products, users } from './sampleData.js';
import { categoryRepository } from '../repositories/categoryRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { createSampleOrders } from './sampleOrderGenerator.js';

export function loadSampleData() {
  // One transaction makes inserting ~1,000 rows much faster.
  transaction(() => {
    if (categoryRepository.count() === 0) {
      const categoryIds = {};
      for (const { key, name, description } of categories) {
        categoryIds[key] = categoryRepository.insert({ name, description }).id;
      }

      if (productRepository.count() === 0) {
        for (const product of products) {
          productRepository.insert({ ...product, categoryId: categoryIds[product.category] });
        }
      }
    }

    if (userRepository.count() === 0) {
      let demoUser;
      for (const user of users) {
        const saved = userRepository.insert(user);
        if (saved.email === 'user@example.com') {
          demoUser = saved;
        }
      }

      // 40 extra customers and about 250 orders - see sampleOrderGenerator.js
      if (orderRepository.count() === 0) {
        createSampleOrders(productRepository.findAll(), demoUser);
      }
    }
  });

  const count = (table) => db.prepare(`SELECT count(*) AS n FROM ${table}`).get().n;
  console.log(`Sample data loaded: ${count('products')} products, ${count('users')} users, ` +
    `${count('orders')} orders.`);
}
