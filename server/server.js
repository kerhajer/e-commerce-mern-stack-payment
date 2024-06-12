const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const cors = require('cors'); // Optional for CORS
const dotenv = require('dotenv').config();
const userrouuter=require('./routes/userrouter')
const productrouter=require('./routes/productrouter')
const cartrouter=require('./routes/cartrouter')
const orderrouter=require('./routes/orderrouter')
const bodyParser = require('body-parser');
const webhook = require('./controllers/webhook');

const app = express();




const cookieParser = require('cookie-parser');



(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process on failure
  }
})();

// Middleware
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.use(cookieParser());
app.use('/api/users',userrouuter)
app.use('/api/products', productrouter);
app.use('/api/addtocart', cartrouter);
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), webhook);

app.use('/api/orders', orderrouter);

// Error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, err => {
  if (err) console.error(err);
  console.log(`Server is running on ${PORT}...`);
});






