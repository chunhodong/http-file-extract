var stripe = require('stripe')('sk_live_FdmsQrMWob5jYoAASNSN6g9R00cKIvO9E7');

stripe.paymentIntents.create(
  {
    amount: 100,
    currency: 'usd',
    payment_method_types: ['card'],
    payment_method:'',
    capture_method: "automatic",
    confirm: "true"
  },
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