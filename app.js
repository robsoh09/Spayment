const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//publickey setting 
const spk = process.env.STRIPE_PUBLISHABLE_KEY;
//simple global variables to act as database to insert pid 
let pid = ""
let bookTitle = "";


var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));


/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', async (req, res) => {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
    let title, amount, error;
  
  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }
  //paymentIntent Generation when selecting a product 
     try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents Required Field
        currency: 'usd', // Currency Required Field 
        automatic_payment_methods: {
          enabled: true,
          },
        });

      console.log('Payment Intent created:', paymentIntent.id);
      console.log('Secret', paymentIntent.client_secret );
      pid =  paymentIntent.id; 
      console.log(pid);
      bookTitle = title;
      console.log(bookTitle);
      res.render('checkout', {
       title: title,
      amount: paymentIntent.amount,
      error: error,
      client_secret: paymentIntent.client_secret, //client_secret for injecting to front-end 
      spk: spk //publishkey frontend usage
    });
       } catch (error) {
        console.error('Error creating Payment Intent:', error.message);
     }

});

/**
 * Success route
 */
app.get('/success', async (req, res) => {
  if(pid === ""){
    res.render('sd')} // render success if somehow webhook process failed
    else {
 
  const paymentIntent = await stripe.paymentIntents.retrieve(
  pid
   );
  console.log(paymentIntent);
  let paymentValue = (paymentIntent.amount * 0.01);
  let paymentId = (paymentIntent.id);
  let paymentStatus = (paymentIntent.status);
  console.log(paymentValue);
  res.render('success', {

    bookTitle: bookTitle,
    paymentValue: paymentValue,
    paymentId: paymentId,
    paymentStatus: paymentStatus
  

  });
}
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});
