// Numbers for the admin dashboard (same as DashboardService.java).

import { productRepository } from '../repositories/productRepository.js';
import { categoryRepository } from '../repositories/categoryRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';

export const dashboardService = {
  getCounts() {
    return {
      products: productRepository.count(),
      categories: categoryRepository.count(),
      users: userRepository.count(),
      orders: orderRepository.count()
    };
  }
};
