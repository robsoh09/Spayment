//form checkout to lock paymentIntent and submit confirmPayment. 
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
//function from Stripe Github to confirmPayment 
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
    
  
});