// Business logic for orders (same rules as OrderService.java).

import { orderRepository } from '../repositories/orderRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { transaction } from '../db/database.js';
import { badRequest, formatLocalDateTime, roundMoney } from '../http/httpUtils.js';
import { validate, notBlank, notNull, email, notEmptyList, wholeNumber, min } from '../http/validation.js';

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Same rules as OrderRequest.java and OrderItemRequest.java
const orderRules = {
  userId: [notNull, wholeNumber],
  customerName: [notBlank],
  email: [notBlank, email],
  phone: [notBlank],
  address: [notBlank],
  city: [notBlank],
  state: [notBlank],
  pincode: [notBlank],
  items: [notEmptyList]
};
const itemRules = {
  productId: [notNull, wholeNumber],
  quantity: [notNull, wholeNumber, min(1)]
};

export const orderService = {
  getAll() {
    return orderRepository.findAll();
  },

  getById(id) {
    const order = orderRepository.findById(id);
    if (!order) {
      throw badRequest(`Order not found with id: ${id}`);
    }
    return order;
  },

  getByUser(userId) {
    return orderRepository.findByUserId(userId);
  },

  create(input) {
    validate(input, orderRules);
    input.items.forEach((item, i) => validate(item, itemRules, `items[${i}].`));

    if (!userRepository.findById(input.userId)) {
      throw badRequest('User not found.');
    }

    // Everything below happens in one transaction: if one product is out of
    // stock, no stock is reduced and no order is saved.
    const orderId = transaction(() => {
      let total = 0;
      const items = [];

      for (const itemRequest of input.items) {
        const product = productRepository.findById(itemRequest.productId);
        if (!product) {
          throw badRequest(`Product not found with id: ${itemRequest.productId}`);
        }
        if (product.stock < itemRequest.quantity) {
          throw badRequest(`Not enough stock for product: ${product.name}`);
        }

        // The item remembers the price at the time of the order.
        items.push({ productId: product.id, quantity: itemRequest.quantity, price: product.price });
        total += product.price * itemRequest.quantity;
        productRepository.updateStock(product.id, product.stock - itemRequest.quantity);
      }

      return orderRepository.insert({
        userId: input.userId,
        orderDate: formatLocalDateTime(new Date()),
        totalAmount: roundMoney(total),
        status: 'PENDING',
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        pincode: input.pincode
      }, items);
    });

    return this.getById(orderId);
  },

  updateStatus(id, statusText) {
    if (statusText === undefined || statusText === null) {
      throw badRequest('Status is required.');
    }
    const newStatus = String(statusText).toUpperCase();
    if (!ORDER_STATUSES.includes(newStatus)) {
      throw badRequest(`Invalid status: ${statusText}. Allowed: ${ORDER_STATUSES.join(', ')}`);
    }

    const order = this.getById(id);
    const oldStatus = order.status;

    if (oldStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
      throw badRequest('A cancelled order cannot be reopened in this simple demo.');
    }

    transaction(() => {
      // Cancelling an order puts its products back in stock.
      if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
        for (const item of order.items) {
          const product = productRepository.findById(item.product.id);
          productRepository.updateStock(product.id, product.stock + item.quantity);
        }
      }
      orderRepository.updateStatus(id, newStatus);
    });

    return this.getById(id);
  }
};
