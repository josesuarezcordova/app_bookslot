require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const router = express.Router();
const { getAvailableSlots, bookAppointment, addSlot } = require('../storage/db');

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
console.log("API server started");

router.get('/appointments', (req, res) => {
    getAvailableSlots((err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ slots: rows });
    });
});

router.post('/book', (req, res) => {
    const { user_name, user_email, slot_id } = req.body;
    console.log(req.body);
    bookAppointment(user_name, user_email, slot_id, function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Appointment booked successfully' });
    });
});

router.post('/pay', async(req, res) => {
    // Payment processing logic here
    const {amount} = req.body;
    console.log("data ", req.body);
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount,10),
            currency: 'usd',
            payment_method_types: ['card'],
        });
        res.json({clientSecret: paymentIntent.client_secret } );
    } catch (error){
        console.error("Payment Error: ", error);
        res.status(500).json({ error: error.message })   
    }
});

// In backend/api/index.js
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;