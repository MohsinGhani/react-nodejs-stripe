const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8085
const stripe = require('stripe')('sk_test_ycjSq5wYnl33VhMcIdAIKZdK00RQ1kaDHR');
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/create-customer', async (req, res) => {
    // Create a new customer object
    const customer = await stripe.customers.create({
        email: req.body.email,
    });

    // Recommendation: save the customer.id in your database.
    res.send({ customer });
});

app.post('/create-subscription', async (req, res) => {
    // Attach the payment method to the customer
    console.log("paymentMethodId", req.body.paymentMethodId)
    console.log("customer", req.body.customerId)
    try {
        await stripe.paymentMethods.attach(req.body.paymentMethodId, {
            customer: req.body.customerId,
        });
    } catch (error) {
        return res.status('402').send({ error: { message: error.message } });
    }

    // Change the default invoice settings on the customer to the new payment method
    await stripe.customers.update(
        req.body.customerId,
        {
            invoice_settings: {
                default_payment_method: req.body.paymentMethodId,
            },
        }
    );

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
        customer: req.body.customerId,
        items: [{ price: 'price_1GsIS0Hf9HxLNSpK3jw34nx2' }],
        expand: ['latest_invoice.payment_intent'],
    });

    res.send(subscription);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))