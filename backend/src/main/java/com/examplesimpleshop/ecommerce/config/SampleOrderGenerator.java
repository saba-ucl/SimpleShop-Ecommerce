package com.examplesimpleshop.ecommerce.config;

import com.examplesimpleshop.ecommerce.entity.Order;
import com.examplesimpleshop.ecommerce.entity.OrderItem;
import com.examplesimpleshop.ecommerce.entity.OrderStatus;
import com.examplesimpleshop.ecommerce.entity.Product;
import com.examplesimpleshop.ecommerce.entity.Role;
import com.examplesimpleshop.ecommerce.entity.User;
import com.examplesimpleshop.ecommerce.repository.OrderRepository;
import com.examplesimpleshop.ecommerce.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Creates sample customers and about 250 sample orders.
 *
 * The random generator uses a FIXED SEED, so every student gets exactly the
 * same customers, products and amounts each time the backend starts.
 * Only the calendar dates move along with "today", because order dates are
 * calculated as "X days ago".
 *
 * Sample orders do NOT reduce product stock: the stock numbers in
 * DataInitializer are treated as the shop's current stock after these orders.
 */
public class SampleOrderGenerator {

    private static final int NUMBER_OF_ORDERS = 250;
    private static final long RANDOM_SEED = 2026L;
    private static final String CUSTOMER_PASSWORD = "password123";

    private static final String[] FIRST_NAMES = {
            "Anna", "Mads", "Sofie", "Frederik", "Ida", "Lucas", "Emma", "Oliver",
            "Freja", "William", "Clara", "Noah", "Laura", "Emil", "Maja", "Magnus",
            "Josefine", "Victor", "Ella", "Malthe", "Karoline", "Oscar", "Alma", "Christian",
            "Mathilde", "Jonas", "Caroline", "Rasmus", "Nanna", "Mikkel", "Sara", "Kasper",
            "Louise", "Anders", "Cecilie", "Jakob", "Julie", "Niklas", "Signe", "Tobias"
    };

    private static final String[] LAST_NAMES = {
            "Jensen", "Nielsen", "Hansen", "Pedersen", "Andersen", "Christensen", "Larsen", "Sørensen",
            "Rasmussen", "Jørgensen", "Petersen", "Madsen", "Kristensen", "Olsen", "Thomsen", "Christiansen",
            "Poulsen", "Johansen", "Møller", "Mortensen", "Knudsen", "Jakobsen", "Mikkelsen", "Frederiksen",
            "Laursen", "Henriksen", "Lund", "Holm", "Schmidt", "Eriksen", "Kristiansen", "Simonsen",
            "Clausen", "Svendsen", "Andreasen", "Iversen", "Jeppesen", "Mogensen", "Vestergaard", "Nissen"
    };

    // City, postal code, region
    private static final String[][] CITIES = {
            {"København K", "1050", "Hovedstaden"},
            {"Frederiksberg", "2000", "Hovedstaden"},
            {"København Ø", "2100", "Hovedstaden"},
            {"København N", "2200", "Hovedstaden"},
            {"Valby", "2500", "Hovedstaden"},
            {"Hellerup", "2900", "Hovedstaden"},
            {"Roskilde", "4000", "Sjælland"},
            {"Køge", "4600", "Sjælland"},
            {"Næstved", "4700", "Sjælland"},
            {"Odense C", "5000", "Syddanmark"},
            {"Svendborg", "5700", "Syddanmark"},
            {"Kolding", "6000", "Syddanmark"},
            {"Esbjerg", "6700", "Syddanmark"},
            {"Vejle", "7100", "Syddanmark"},
            {"Herning", "7400", "Midtjylland"},
            {"Aarhus C", "8000", "Midtjylland"},
            {"Silkeborg", "8600", "Midtjylland"},
            {"Horsens", "8700", "Midtjylland"},
            {"Randers", "8900", "Midtjylland"},
            {"Aalborg", "9000", "Nordjylland"},
            {"Hjørring", "9800", "Nordjylland"}
    };

    private static final String[] STREETS = {
            "Vestergade", "Østergade", "Nørregade", "Søndergade", "Algade", "Skolegade",
            "Kirkevej", "Parkvej", "Skovvej", "Strandvejen", "Engvej", "Birkevej",
            "Bøgevej", "Egevej", "Møllevej", "Stationsvej", "Havnegade", "Torvegade"
    };

    /** Delivery details that stay the same for every order from one customer. */
    private record Customer(User user, String phone, String address, String city, String postalCode, String region) {
    }

    public static void create(UserRepository userRepository,
                              OrderRepository orderRepository,
                              List<Product> products,
                              User demoUser) {
        Random random = new Random(RANDOM_SEED);

        // ---- 1. Customers ----
        List<Customer> customers = new ArrayList<>();
        for (int i = 0; i < FIRST_NAMES.length; i++) {
            if (i == 6) {
                // The demo user (user@example.com) gets a handful of orders, so "My Orders" has data
                customers.add(newCustomer(demoUser, random));
            }
            String firstName = FIRST_NAMES[i];
            String lastName = LAST_NAMES[i];
            String email = (firstName + "." + lastName + "@example.com")
                    .toLowerCase()
                    .replace("ø", "oe").replace("æ", "ae").replace("å", "aa");
            User user = userRepository.save(new User(firstName + " " + lastName, email, CUSTOMER_PASSWORD, Role.USER));
            customers.add(newCustomer(user, random));
        }

        // ---- 2. Product popularity: some products sell much more than others ----
        int[] popularity = new int[products.size()];
        int totalPopularity = 0;
        for (int i = 0; i < products.size(); i++) {
            popularity[i] = 1 + random.nextInt(8);
            totalPopularity += popularity[i];
        }

        // ---- 3. Orders ----
        LocalDateTime now = LocalDateTime.now();
        for (int n = 0; n < NUMBER_OF_ORDERS; n++) {
            // Raising the random number to a power makes the first customers order more often,
            // so there are a few "loyal customers" and many occasional ones.
            double r = Math.pow(random.nextDouble(), 1.5);
            Customer customer = customers.get((int) (r * customers.size()));

            // About 15% of orders are from the last two weeks, so there are
            // pending/confirmed/shipped orders for the admin to work with.
            int daysAgo = random.nextInt(100) < 15 ? random.nextInt(14) : random.nextInt(365);
            LocalDateTime orderDate = now.minusDays(daysAgo)
                    .withHour(8 + random.nextInt(14))
                    .withMinute(random.nextInt(60))
                    .withSecond(0)
                    .withNano(0);

            Order order = new Order();
            order.setUser(customer.user());
            order.setOrderDate(orderDate);
            order.setStatus(statusFor(daysAgo, random));
            order.setCustomerName(customer.user().getName());
            order.setEmail(customer.user().getEmail());
            order.setPhone(customer.phone());
            order.setAddress(customer.address());
            order.setCity(customer.city());
            order.setState(customer.region());
            order.setPincode(customer.postalCode());

            // 1-4 different products per order
            int numberOfProducts = Math.min(1 + random.nextInt(4), products.size());
            List<Product> chosen = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;
            while (chosen.size() < numberOfProducts) {
                Product product = pickProduct(products, popularity, totalPopularity, random);
                if (chosen.contains(product)) {
                    continue;
                }
                chosen.add(product);

                int quantity = quantity(random);
                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setQuantity(quantity);
                item.setPrice(product.getPrice()); // price at the time of the order
                order.addItem(item);

                total = total.add(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            }
            order.setTotalAmount(total);
            orderRepository.save(order);
        }
    }

    private static Customer newCustomer(User user, Random random) {
        String[] city = CITIES[random.nextInt(CITIES.length)];
        String address = STREETS[random.nextInt(STREETS.length)] + " " + (1 + random.nextInt(120));
        String phone = String.valueOf(20000000 + random.nextInt(80000000)); // 8 digits, like a Danish number
        return new Customer(user, phone, address, city[0], city[1], city[2]);
    }

    /** Older orders are delivered; recent orders are still on their way. About 7% are cancelled. */
    private static OrderStatus statusFor(int daysAgo, Random random) {
        if (random.nextInt(100) < 7) {
            return OrderStatus.CANCELLED;
        }
        if (daysAgo < 2) {
            return OrderStatus.PENDING;
        }
        if (daysAgo < 4) {
            return random.nextBoolean() ? OrderStatus.PENDING : OrderStatus.CONFIRMED;
        }
        if (daysAgo < 7) {
            return random.nextBoolean() ? OrderStatus.CONFIRMED : OrderStatus.SHIPPED;
        }
        if (daysAgo < 14) {
            return random.nextBoolean() ? OrderStatus.SHIPPED : OrderStatus.DELIVERED;
        }
        return OrderStatus.DELIVERED;
    }

    /** Mostly 1 item, sometimes 2 or 3. */
    private static int quantity(Random random) {
        int r = random.nextInt(10);
        if (r < 7) {
            return 1;
        }
        return r < 9 ? 2 : 3;
    }

    /** Picks a product, where popular products are picked more often. */
    private static Product pickProduct(List<Product> products, int[] popularity, int totalPopularity, Random random) {
        int ticket = random.nextInt(totalPopularity);
        for (int i = 0; i < products.size(); i++) {
            ticket -= popularity[i];
            if (ticket < 0) {
                return products.get(i);
            }
        }
        return products.get(products.size() - 1);
    }
}
