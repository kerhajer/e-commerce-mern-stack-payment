const dotenv = require("dotenv").config();
const order = require("../models/orderschema");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cart=require ("../models/cartschema");

const endpoint_secret = process.env.ENDPOINT_SECRET_KEY;



const getLineItems = async (lineItems) => {
    let productItems = [];
    console.log('Line Items:', lineItems);
    if (lineItems.data.length) {
      for (const item of lineItems.data) {
        const product = await stripe.products.retrieve(item.price.product);
        const productId = product.metadata.productId;
        
        const productData = {
          productId: productId,
          name: product.name,
          price: item.price.unit_amount / 100,
          quantity: item.quantity,
          image: product.images
        };
        console.log('pro',product)
        productItems.push(productData);
      }
    }
    return productItems;
  };
  
  const webhook = async (req, res) => {
  
    const sig = req.headers['stripe-signature']
    const  payloadString = JSON.stringify(req.body);
    console.log('Received Webhook Event:', payloadString);

    const header=stripe.webhooks.generateTestHeaderString({
        payload:payloadString,secret: endpoint_secret})
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payloadString, header, endpoint_secret);
      console.log('Constructed Event:', event);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    switch (event.type) {
      case 'checkout.session.completed':
        try {
          const session = event.data.object;
          console.log('Checkout Session:', session);
  
          // Verify session data
          if (!session.metadata || !session.metadata.userId || !session.customer_details.email) {
            console.error('Missing session metadata or customer details');
            res.status(400).send('Missing session metadata or customer details');
            return;
          }
  
          
  
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          console.log('Line Items:', lineItems);
          const productDetails = await getLineItems(lineItems);
          console.log('Product Details:', productDetails);
  
          const orderDetails = {
            productDetails: productDetails,
            email: session.customer_details.email,
            userId: session.metadata.userId,
            paymentDetails: {
              paymentId: session.payment_intent,
              payment_method_type: session.payment_method_types,
              payment_status: session.payment_status,
              shipping_options: session.shipping_options,
              totalAmount: session.amount_total / 100
            }
          };
  
          console.log('Order Details:', orderDetails);
  
          const newOrder = new order(orderDetails);
          const savedorder=await newOrder.save();


if(savedorder?._id){
    const deletecart = await cart.deleteMany({ userId: session.metadata.userId });

}




          console.log('Order successfully created:', newOrder);
  
          res.status(200).send('Order created successfully');
        } catch (err) {
          console.error('Error creating order:', err);
          if (err.code === 11000) { // Duplicate key error
            res.status(400).send('Duplicate order for this session');
          } else if (err.name === 'ValidationError') {
            res.status(400).send('Invalid order data: ' + err.message);
          } else {
            res.status(500).send('Internal Server Error');
          }
        }
  
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send();
}

module.exports =  webhook ;