var stripe = require('stripe')('');

stripe.tokens.create(
  {
    card: {
      number: '',
      exp_month:2 ,
      exp_year: 3,
      cvc: '',
    },
  },
  function(err, token) {
      if(err){
          console.log(err);
      }
      else{
          console.log(token);
      }
    // asynchronously called
  }
);