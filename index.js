var stripe = require('stripe')('');

// To create a PaymentIntent, see our guide at: https://stripe.com/docs/payments/payment-intents/creating-payment-intents#creating-for-automatic
stripe.paymentIntents.cancel(
  '',
  function(err, paymentIntent) {
    // asynchronously called
    if(err){
        console.log(err);
    }
    if(!err){
        console.log(paymentIntent);
    }
    
  }
);