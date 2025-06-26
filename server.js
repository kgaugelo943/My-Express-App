const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//Products array
let products = [
    {
      id: 1,
      name: "Cup cake",
      description: "Soft, fluffy and moist cake.",
      price: 40.99,
      category: "Bakery sweet treat",
      inStock: true
    },
    {
      id: 2,
      name: "Wholegrain Bread",
      description: "Healthy seeded bread loaf.",
      price: 30.00,
      category: "Bakery savory treat",
      inStock: false
    }
  ];
// GET all products
  app.get('/products', (req, res) => {
    res.json(products);
  });
  
// GET a product by ID
  app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  });
  
// POST a new product
  app.post('/products', (req, res) => {
    const newProduct = {
      id: products.length + 1,
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

// PUT to update a product
    app.put('/products/:id', (req, res) => {
      const product = products.find(p => p.id === parseInt(req.params.id));
      if (!product) return res.status(404).send('Product not found');
      
      Object.assign(product, req.body);
      res.json(product);
    });

// DELETE a product 
    app.delete('/products/:id', (req, res) => {
      const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
      if (productIndex === -1) return res.status(404).send('Product not found');
      
      const deletedProduct = products.splice(productIndex, 1);
      res.json(deletedProduct);
    });

// Middleware: Custom Logger
    const logger= (req, res, next) => {
        const time = new Date().toISOString();
        console.log(`[${time}] ${req.method} request to ${req.url}`);
        next();
    };
    app.use(logger);

// Middleware: JSON Parser
    app.use(express.json()); 


// Middleware: Authentication
    const authenticate = (req, res, next) => {
        const apiKey = req.headers['x-api-key'];
        if (apiKey === '15940') {
            next();
        } else {
            res.status(401).send('Unauthorized: Invalid API Key'); 
        }
    };

// Middleware: validate product data
    const validateProduct = (req, res, next) => {
        const { name, description, price, category, inStock } = req.body;
        if (
            typeof name !== 'string' ||
            typeof description !== 'string' ||
            typeof price !== 'number' ||
            typeof category !== 'string' ||
            typeof inStock !== 'boolean'
          ) {
            return res.status(400).json({ error: 'Invalid product data' });
          }
        
          next();
        };

//Implement global error handling middleware

    app.use((err, req, res, next) => {
     console.error(err.stack);
        res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
        });
    });

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Fake async function to simulate DB
const fakeDBCall = (id) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === '1') resolve({ id: 1, name: "Test Product" });
      else reject(new NotFoundError('Product not found'));
    }, 500);
  });
  
// Async route using wrapper
  app.get('/async-products/:id', authenticate, asyncHandler(async (req, res, next) => {
    const product = await fakeDBCall(req.params.id);
    res.json(product);
  }));
  


app.get('/products', authenticate, (req, res) => {
    const { category, page = 1, limit = 5 } = req.query;
  
    let filteredProducts = products;
  
    // Filter by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
  
    // Pagination
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const startIndex = (pageInt - 1) * limitInt;
    const endIndex = startIndex + limitInt;
  
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
    res.json({
      total: filteredProducts.length,
      page: pageInt,
      limit: limitInt,
      data: paginatedProducts
    });
  });
   
// Count by category
app.get('/products/stats', authenticate, (req, res) => {
    const stats = {};
  
    products.forEach(p => {
      const cat = p.category.toLowerCase();
      stats[cat] = (stats[cat] || 0) + 1;
    });
  
    res.json(stats);
  });
  
//Search products by name 
app.get('/products/search', authenticate, (req, res) => {
    const { name } = req.query;
  
    if (!name) {
      return res.status(400).json({ error: 'Search term "name" is required' });
    }
  
    const results = products.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  
    res.json(results);
  });
   

  
          