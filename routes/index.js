var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/charge', function(req, res, next) {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here https://dashboard.stripe.com/account/apikeys
  var stripe = require("stripe")("sk_test_SJDWdsaMeB97VB7ynhdpjMS8");

  // (Assuming you're using express - expressjs.com)
  // Get the credit card details submitted by the form
  var stripeToken = req.body.id;

  console.log('stripeToken', stripeToken)
  var charge = stripe.charges.create({
    amount: 1000, // amount in cents, again
    currency: "usd",
    source: stripeToken,
    description: "Example charge"
  }, function(err, charge) {
    console.log('err', err, 'charge', charge)
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      return res.send(err);
    }
    return res.send(charge);
  });
});

module.exports = router;
