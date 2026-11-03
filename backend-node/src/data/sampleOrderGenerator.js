// Creates 40 sample customers and 250 sample orders.
// A line-by-line port of backend/.../config/SampleOrderGenerator.java.
//
// It uses the same random number generator and the same FIXED SEED as Java,
// so both backends create exactly the same customers, products and amounts.
// Only the calendar dates move along with "today", because order dates are
// calculated as "X days ago".
//
// Sample orders do NOT reduce product stock: the stock numbers in
// sampleData.js are treated as the shop's current stock after these orders.

import { JavaRandom } from './javaRandom.js';
import { userRepository } from '../repositories/userRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { formatLocalDateTime, roundMoney } from '../http/httpUtils.js';

const NUMBER_OF_ORDERS = 250;
const RANDOM_SEED = 2026;
const CUSTOMER_PASSWORD = 'password123';

const FIRST_NAMES = [
  "Anna", "Mads", "Sofie", "Frederik", "Ida", "Lucas", "Emma", "Oliver",
  "Freja", "William", "Clara", "Noah", "Laura", "Emil", "Maja", "Magnus",
  "Josefine", "Victor", "Ella", "Malthe", "Karoline", "Oscar", "Alma", "Christian",
  "Mathilde", "Jonas", "Caroline", "Rasmus", "Nanna", "Mikkel", "Sara", "Kasper",
  "Louise", "Anders", "Cecilie", "Jakob", "Julie", "Niklas", "Signe", "Tobias",
];

const LAST_NAMES = [
  "Jensen", "Nielsen", "Hansen", "Pedersen", "Andersen", "Christensen", "Larsen", "Sørensen",
  "Rasmussen", "Jørgensen", "Petersen", "Madsen", "Kristensen", "Olsen", "Thomsen", "Christiansen",
  "Poulsen", "Johansen", "Møller", "Mortensen", "Knudsen", "Jakobsen", "Mikkelsen", "Frederiksen",
  "Laursen", "Henriksen", "Lund", "Holm", "Schmidt", "Eriksen", "Kristiansen", "Simonsen",
  "Clausen", "Svendsen", "Andreasen", "Iversen", "Jeppesen", "Mogensen", "Vestergaard", "Nissen",
];

const STREETS = [
  "Vestergade", "Østergade", "Nørregade", "Søndergade", "Algade", "Skolegade", "Kirkevej", "Parkvej",
  "Skovvej", "Strandvejen", "Engvej", "Birkevej", "Bøgevej", "Egevej", "Møllevej", "Stationsvej",
  "Havnegade", "Torvegade",
];

// City, postal code, region
const CITIES = [
  ["København K", "1050", "Hovedstaden"],
  ["Frederiksberg", "2000", "Hovedstaden"],
  ["København Ø", "2100", "Hovedstaden"],
  ["København N", "2200", "Hovedstaden"],
  ["Valby", "2500", "Hovedstaden"],
  ["Hellerup", "2900", "Hovedstaden"],
  ["Roskilde", "4000", "Sjælland"],
  ["Køge", "4600", "Sjælland"],
  ["Næstved", "4700", "Sjælland"],
  ["Odense C", "5000", "Syddanmark"],
  ["Svendborg", "5700", "Syddanmark"],
  ["Kolding", "6000", "Syddanmark"],
  ["Esbjerg", "6700", "Syddanmark"],
  ["Vejle", "7100", "Syddanmark"],
  ["Herning", "7400", "Midtjylland"],
  ["Aarhus C", "8000", "Midtjylland"],
  ["Silkeborg", "8600", "Midtjylland"],
  ["Horsens", "8700", "Midtjylland"],
  ["Randers", "8900", "Midtjylland"],
  ["Aalborg", "9000", "Nordjylland"],
  ["Hjørring", "9800", "Nordjylland"],
];

// Delivery details that stay the same for every order from one customer.
function newCustomer(user, random) {
  const [city, postalCode, region] = CITIES[random.nextInt(CITIES.length)];
  const address = `${STREETS[random.nextInt(STREETS.length)]} ${1 + random.nextInt(120)}`;
  const phone = String(20000000 + random.nextInt(80000000)); // 8 digits, like a Danish number
  return { user, phone, address, city, postalCode, region };
}

// Older orders are delivered; recent orders are still on their way. About 7% are cancelled.
function statusFor(daysAgo, random) {
  if (random.nextInt(100) < 7) {
    return 'CANCELLED';
  }
  if (daysAgo < 2) {
    return 'PENDING';
  }
  if (daysAgo < 4) {
    return random.nextBoolean() ? 'PENDING' : 'CONFIRMED';
  }
  if (daysAgo < 7) {
    return random.nextBoolean() ? 'CONFIRMED' : 'SHIPPED';
  }
  if (daysAgo < 14) {
    return random.nextBoolean() ? 'SHIPPED' : 'DELIVERED';
  }
  return 'DELIVERED';
}

// Mostly 1 item, sometimes 2 or 3.
function quantity(random) {
  const r = random.nextInt(10);
  if (r < 7) {
    return 1;
  }
  return r < 9 ? 2 : 3;
}

// Picks a product, where popular products are picked more often.
function pickProduct(products, popularity, totalPopularity, random) {
  let ticket = random.nextInt(totalPopularity);
  for (let i = 0; i < products.length; i++) {
    ticket -= popularity[i];
    if (ticket < 0) {
      return products[i];
    }
  }
  return products[products.length - 1];
}

// products: all products sorted by id. demoUser: the user@example.com user.
export function createSampleOrders(products, demoUser) {
  const random = new JavaRandom(RANDOM_SEED);

  // ---- 1. Customers ----
  const customers = [];
  for (let i = 0; i < FIRST_NAMES.length; i++) {
    if (i === 6) {
      // The demo user (user@example.com) gets a handful of orders, so "My Orders" has data
      customers.push(newCustomer(demoUser, random));
    }
    const firstName = FIRST_NAMES[i];
    const lastName = LAST_NAMES[i];
    const email = `${firstName}.${lastName}@example.com`
      .toLowerCase()
      .replaceAll('ø', 'oe').replaceAll('æ', 'ae').replaceAll('å', 'aa');
    const user = userRepository.insert({
      name: `${firstName} ${lastName}`, email, password: CUSTOMER_PASSWORD, role: 'USER'
    });
    customers.push(newCustomer(user, random));
  }

  // ---- 2. Product popularity: some products sell much more than others ----
  const popularity = products.map(() => 1 + random.nextInt(8));
  const totalPopularity = popularity.reduce((sum, p) => sum + p, 0);

  // ---- 3. Orders ----
  const now = new Date();
  for (let n = 0; n < NUMBER_OF_ORDERS; n++) {
    // Raising the random number to a power makes the first customers order more often,
    // so there are a few "loyal customers" and many occasional ones.
    const r = Math.pow(random.nextDouble(), 1.5);
    const customer = customers[Math.floor(r * customers.length)];

    // About 15% of orders are from the last two weeks, so there are
    // pending/confirmed/shipped orders for the admin to work with.
    const daysAgo = random.nextInt(100) < 15 ? random.nextInt(14) : random.nextInt(365);
    const orderDate = new Date(now);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    const hour = 8 + random.nextInt(14);
    const minute = random.nextInt(60);
    orderDate.setHours(hour, minute, 0, 0);

    const status = statusFor(daysAgo, random);

    // 1-4 different products per order
    const numberOfProducts = Math.min(1 + random.nextInt(4), products.length);
    const chosen = [];
    const items = [];
    let total = 0;
    while (chosen.length < numberOfProducts) {
      const product = pickProduct(products, popularity, totalPopularity, random);
      if (chosen.includes(product)) {
        continue;
      }
      chosen.push(product);

      const qty = quantity(random);
      items.push({ productId: product.id, quantity: qty, price: product.price }); // price at the time of the order
      total += product.price * qty;
    }

    orderRepository.insert({
      userId: customer.user.id,
      orderDate: formatLocalDateTime(orderDate),
      totalAmount: roundMoney(total),
      status,
      customerName: customer.user.name,
      email: customer.user.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.region,
      pincode: customer.postalCode
    }, items);
  }
}
