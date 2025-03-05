const express = require('express');
const { getAllProducts, getProductsById, searchProductsByName, getCategoryById, addNewProduct, updateProducts, getCustomerById, deleteProduct, updateCustomer, getOrdersByCustomer, getProductStats, getReviewStats, cascadeDelete, cascadeUpdate } = require('./database'); // Importera databasanslutningen
const app = express();
const PORT = 8000;

app.use(express.json());

app.listen(PORT, () => {
  console.log('server is running');
})

// Hämta alla produkter
app.get('/products', (req, res) => {
  res.json(getAllProducts())
});


// Hämta produkt med ID
app.get('/products/:id', (req, res) => {
  res.json(getProductsById(req.params.id))
});

// Hämta produkt med namn
app.get('/products/search/:name', (req, res) => {
  res.json(searchProductsByName(req.params.name))
});


// Hämta kategori med ID
app.get('/products_categories/:id', (req, res) => {
  res.json(getCategoryById(req.params.id))
});


// Lägg till produkt 
// Postman input 
// {
    // "manufacturer_id": ,
    // "name": "",
    // "description": "",
    // "price": ,
    // "stock_quantity": 
// }
app.post('/products', (req, res) => {
  const { manufacturer_id, name, description, price, stock_quantity } = req.body;
  res.status(201).json(addNewProduct(manufacturer_id, name, description, price, stock_quantity));
});


// Uppdatera produkt
app.put('/products/:id', (req, res) => {
  const { manufacturer_id, name, description, price, stock_quantity } = req.body;
  res.status(201).json(updateProducts(req.params.id, manufacturer_id, name, description, price, stock_quantity))
});


// Radera produkt 
app.delete("/products/:id", (req, res) => {
  res.send(deleteProduct(req.params.id));
});

// Hämta customers med orderhistorik via JOIN 
app.get('/customers/:id', (req, res) => {
  res.json(getCustomerById(req.params.id))
});


//Uppdatera customers med ID
app.put('/customers/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  const customerId = req.params.id;

  const updatedCustomer = updateCustomer(name, email, phone, address, customerId);

  if (updatedCustomer) {
    res.status(200).json(updatedCustomer);  // Returnera den uppdaterade kundens data
  } else {
    res.status(400).json({ message: 'Failed to update customer.' });  // Misslyckades med att uppdatera
  }
});


//Hämta order via customer ID
app.get("/customers/:id/orders", (req, res) => {
  res.send(getOrdersByCustomer(req.params.id));
});


//Hämta statistik för kategorier
app.get("/products/stats/categories", (req, res) => {
  res.send(getProductStats());
});

//Hämta statistik för reviews
app.get("/products/stats/reviews", (req, res) => {
  res.send(getReviewStats());
});

app.post("/cascade-update", (req, res) => {
  try {
    cascadeUpdate();
    res.status(200).json({ message: "Cascade update genomförd" });
  } catch (error) {
    console.error("Fel vid cascade update:", error);
    res.status(500).json({ error: "Något gick fel vid uppdateringen" });
  }
});


