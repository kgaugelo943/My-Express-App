# My-Express-App
# Product API with Express.js

This is a simple RESTful API for managing products, including filtering, pagination, searching, and product statistics. Built with **Node.js** and **Express.js**.

---

## 🚀 How to Run the Server

1. **Clone the repository** (if applicable) or navigate to your project folder.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a ****\`\`**** file** based on the provided `.env.example`. Example:

   ```bash
   cp .env.example .env
   ```

4. **Run the server**

   ```bash
   node server.js
   ```

5. Server runs at:

   ```
   http://localhost:3000
   ```

---

## 🔑 Required Environment Variables

See `.env.example` file.

---

## 📦 API Endpoints

### ✅ **Authentication**

All protected routes require the following header:

```http
x-api-key: YOUR_API_KEY_HERE
```

---

### 📃 **Product Endpoints**

| Method | Endpoint           | Description                                                  |
| ------ | ------------------ | ------------------------------------------------------------ |
| GET    | `/products`        | List products, supports filtering by category and pagination |
| GET    | `/products/search` | Search products by name (case-insensitive)                   |
| GET    | `/products/stats`  | Get product statistics (count by category)                   |
| GET    | `/products/:id`    | Get a single product by ID                                   |
| POST   | `/products`        | Create a new product (validation applied)                    |
| PUT    | `/products/:id`    | Update an existing product (validation applied)              |

---

## 🔍 **Query Parameters**

### `/products`

| Param      | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `category` | String | Filter products by category    |
| `page`     | Number | Page number (default: 1)       |
| `limit`    | Number | Products per page (default: 5) |

**Example:**

```
GET /products?category=Beverages&page=1&limit=2
```

---

### `/products/search`

| Param  | Type   | Description                  |
| ------ | ------ | ---------------------------- |
| `name` | String | Search term for product name |

**Example:**

```
GET /products/search?name=juice
```

---

## 📦 **Example Product JSON**

```json
{
  "id": 1,
  "name": "Wholegrain Bread",
  "description": "Healthy seeded bread loaf",
  "price": 30.00,
  "category": "Bakery",
  "inStock": false
}
```

---

## 📊 **Example Product Statistics Response**

```
GET /products/stats
```

**Response:**

```json
{
  "savory": 2,
  "sweet treats": 1
}
```

---

## ⚠️ **Error Responses**

Example of error for invalid API key:

```json
{
  "error": "UnauthorizedError",
  "message": "Invalid or missing API key"
}
```

Example of validation error:

```json
{
  "error": "ValidationError",
  "message": "Invalid product data"
}
```

---

## 🛠 Dependencies

* Node.js
* Express.js

---

# .env.example

```env
PORT=3000
API_KEY=12345

