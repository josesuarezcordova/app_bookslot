require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const router = express.Router();
const { db, getAvailableSlots, bookAppointment, addSlot } = require('../storage/db');

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
console.log("API server started");

router.get('/appointments', (req, res) => {
    getAvailableSlots((err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Filter out booked slots (assuming slot.booked is 1 for booked, 0 for available)
        const availableSlots = rows.filter(slot => !slot.booked);
        res.json({ slots: availableSlots });
    });
});

router.post('/book', (req, res) => {
    const { user_name, user_email, slot_id } = req.body;
    console.log(req.body);
    bookAppointment(user_name, user_email, slot_id, async function(err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        // Mark slot as booked in the DB
        try {
            await db.run('UPDATE slots SET booked = 1 WHERE id = ?', [slot_id]);
            res.json({ message: 'Appointment booked successfully' });
        } catch (updateErr) {
            res.status(500).json({ error: updateErr.message });
        }
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