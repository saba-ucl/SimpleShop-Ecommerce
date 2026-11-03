# SimpleShop — Node.js Backend

A second version of the SimpleShop backend, written in **plain Node.js with no npm packages**.

It has exactly the same REST API as the Java backend in `../backend`: same port, same URLs, same JSON and same error messages. The React frontend works with either backend without any changes.

---

## Requirements

- **Node.js 22.13 or newer** (24 LTS recommended). Check with `node -v`.

That's all. No database to install and no `npm install` needed: the database is SQLite, which is built into Node.js (`node:sqlite`) and runs in memory.

---

## Run

```bash
cd backend-node
npm start
```

When you see:

```text
Sample data loaded: 60 products, 42 users, 250 orders.
SimpleShop Node backend running on http://localhost:8181
```

the API is ready. Try <http://localhost:8181/api/products>.

Then start the frontend as usual in another terminal (`cd frontend`, `npm start`) and open <http://localhost:3000>.

Stop the backend with `Ctrl + C`. Like the Java version, **all data is reset when it stops.**

`npm run dev` does the same as `npm start`, but restarts the server automatically when you save a file.

> Only one backend can run at a time, because both use port 8181. Stop the Java backend before starting this one, and the other way around.

---

## Project structure

The folders mirror the layers of the Java backend:

```text
backend-node/
├── package.json                 start scripts (no dependencies)
└── src/
    ├── server.js                starts the HTTP server, CORS, error handling
    ├── config.js                port, host, allowed frontend origin
    ├── http/
    │   ├── router.js            connects "GET /api/products/:id" to a function
    │   ├── httpUtils.js         reading JSON bodies, sending JSON responses
    │   └── validation.js        @NotBlank, @Email, @Min ... as functions
    ├── controllers/             one file per resource, like ProductController.java
    ├── services/                business rules, like ProductService.java
    ├── repositories/            all SQL, like ProductRepository.java
    ├── db/
    │   ├── schema.sql           the tables
    │   └── database.js          opens the in-memory SQLite database
    └── data/
        ├── sampleData.js        categories, 60 products, 2 demo users
        ├── sampleOrderGenerator.js   40 customers and 250 orders
        ├── javaRandom.js        a copy of java.util.Random
        └── dataInitializer.js   fills the database on startup
```

A request travels like this:

```text
server.js → router → controller → service → repository → SQLite
```

### Java vs. Node, side by side

| Java backend | Node backend |
|---|---|
| `@RestController` + `@GetMapping("/{id}")` | `router.get('/api/products/:id', ...)` in `controllers/` |
| `@Service` classes | plain objects in `services/` |
| Spring Data `JpaRepository` (SQL generated) | `repositories/` with hand-written SQL |
| Hibernate creates tables from `@Entity` classes | `db/schema.sql` |
| `@NotBlank`, `@Email`, `@Min` on DTOs | `validate(body, { name: [notBlank] })` |
| `@Transactional` | `transaction(() => { ... })` |
| `@RestControllerAdvice` | `handleError()` in `server.js` |
| `CorsConfig.java` | `applyCors()` in `server.js` |
| H2 in-memory database | SQLite in-memory database |
| `DataInitializer.java` | `data/dataInitializer.js` |

---

## Sample data

Exactly the same as the Java backend:

- 4 categories and 60 products, prices in DKK
- `admin@example.com` / `admin123` (admin) and `user@example.com` / `user123`
- 40 customers (`firstname.lastname@example.com`, password `password123`)
- 250 orders over the last year

The order generator uses a JavaScript copy of `java.util.Random` with the same seed, so **both backends create identical customers and orders**: the same names, addresses, products, quantities and totals. Only the dates move along with today's date. SQL exercises therefore give the same answers on both backends.

---

## Looking at the database

The database lives in memory inside the Node process, so there is no H2-style browser console. The tables and columns are the same as in the Java backend (`products`, `categories`, `users`, `orders`, `order_items`), so the same SQL queries work on both.

---

## Differences from the Java backend

They are small, and none of them affect the frontend:

- Searching products ignores upper/lower case for the letters A–Z only. "æ, ø, å" must match exactly.
- New orders store their time without fractions of a second.
- A wrong id such as `/api/products/abc` gives `400 Bad Request` instead of a server error.
- The Java backend sometimes answers a duplicate category name or a missing name with a vague database message. The Node backend gives a clear one.

---

## Security note

Like the Java version, this is a teaching project: passwords are stored as plain text and the API has no real authentication. Don't use it as a template for a real shop.
