var stripe = require('stripe')('');

stripe.paymentMethods.create(
  {
    type: 'card',
    card: {
      number: '',
      exp_month: 1,
      exp_year: 1,
      cvc: '402',
    },
  },
  function(err, paymentMethod) {
    // asynchronously called
    if(err){
        console.log('err : ',err);
    }
    else{
        console.log('paymentMethod : ',paymentMethod);
        
    }
  }
);