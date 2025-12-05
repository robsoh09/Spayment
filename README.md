Assignment: Rob Soh Ming Yang 

This document explains how I approach a take-home payment assignment from a presales perspective. My focus is to keep the solution torwards the business needs.

1. Start With the Goal and functional requirements 

Before proceed I first clarify:
What the business is trying to do  
What a successful outcome (in this case, customer payment) 

This helps me avoid overbuilding a demo when its required and keeps the solution straightforard.

2. Business needs to Business logic 
I define a flow and map it accordingly. In the assignment: 
Customer -> Purchase -> Submits Payment -> Return Success / Failure  

This makes it easy for both the business and tech  to follow what is happening.

3. Show only what is required
   
I only set up what is required for the use case:
One-time payments which may include basic success and simple failure handling  
confirmation of payment status  

This keeps the demo realistic enough

4. Build a Working Demo

My priority is to deliver outcomes mapped to requirements:

One successful payment  
A confirmation outcome   
A smooth user experience  

5. Explain simply

I make sure I explain:
What happens at each step and why it is used for
A visual representation at each step aligned to the business outcome 


6.  Next Steps
   
my focus is to ensure customer can have the best understanding and seeing is believing 
A working demo provides this approach. Once this is confirmed, i will present the common risks(if any) and will proceed to the next step with the customer.

Solution Assignment Overview: 
1. Learning & Environment Setup

Acting as a newly onboarded Solution Engineer, I first created a Stripe account, enabled payments in the Stripe Dashboard, and generated API keys for development. I followed Stripe’s official development environment setup and payments documentation to evaluate the Node.js SDK and payment APIs. I focused on online card payments using Stripe Elements and PaymentIntents as real-world e-commerce requirements for Stripe Press.

2. API Flow & Understanding
From the documentation and Stripe GitHub samples, I was able have an initial understanding of the client-server payment model. The backend uses the Secret Key for sensitive operations such as creating PaymentIntents. The frontend uses the Publishable Key for Stripe Elements and confirms payments using the client_secret.
Webhooks were used for production-grade payment status handling. 

links used: 
https://docs.stripe.com/payments/quickstart 
https://docs.stripe.com/payments/online-payments#compare-features-and-availability
https://docs.stripe.com/payments/use-cases/get-started 


3. Solution Scope 

The scope of the solution in this case:

A customer will order  the product, go to the payment landing page, enter required details and submit an order request. 
The backend route will in turn, make a Stripe PaymentIntent system call to Stripe 
Stripe returns a new Payment Intent to the e-store frontend 
Customer will provide payment billing detail like credit card number  and submits the payment 
Stripe will proceed to process the payment and return the payment status via webhook events, triggering business workflows. 
The front end is updated with the payment status for the client. 

4. Demo Implementation
Technology Stack:
Node.js, Express, Handlebars (HBS), Stripe SDK, Stripe Elements
A demo was created based on https://docs.stripe.com/payments/quickstart. 

The APIs used in this demo: 
Stripe.paymentIntent on the backend: 
     try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents Required Field
        currency: 'usd', // Currency Required Field 
        automatic_payment_methods: {
          enabled: true,
          },
        });

This creates an Intent with the amount required and currency in USD. 

Stripe Elements Mounting on the frontend: 
 <script> const stripe = Stripe('{{spk}}');
              const options = {
              clientSecret: '{{client_secret}}',
              }; 
             const elements = stripe.elements(options); 
             const paymentElement = elements.create('payment');
              paymentElement.mount('#payment-element') </script> 
            
This mounts the payment element into the checkout page. 

Payment Confirmation using Stripe.ConfirmPayment at Frontend: 
const {error} = await stripe.confirmPayment({
    //elements instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: 'http://localhost:3000/success',
    },
  });

  if (error) {
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  }

This returns confirmPayment sdk call and since elements have already a clientSecret called upon, the payment was succesful and got redirected to success. 

on the backend payment success route: 
a sdk call was made to retrieve the pid or paymentIntentid and get the payment response and status. 
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


5. Outcome:
A complete Stripe Elements payment flow was successfully implemented and tested locally. A sample is attached below: 
http://localhost:3000/success?payment_intent=pi_3SaxVc60m4YgZHoW1H1IbS8o&redirect_status=succeeded

The demo was able to show this successfully by creating PaymentIntents, confirmingthe payment with Stripe Elements and displaying the pid and confirmation status to the customer. 

6. Additional Enhancements:
This only showcases payment process but not adding of shipping address, billing or taxes.
Webhook integration on business logic such as inventory mapping when a successful payment is conducted can be considered to help customers.



I have also included instructions to clone and run this in the customer demo solution PDF as attached. 


  







