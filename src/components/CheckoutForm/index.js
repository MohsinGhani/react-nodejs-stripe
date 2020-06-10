import React, { useState } from 'react';
import {
    CardElement,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';
import './index.css'

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

const CheckoutForm = () => {
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    }

    // Handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const cardElement = elements.getElement(CardElement);

        return stripe
            .createPaymentMethod({
                type: 'card',
                card: cardElement,
            })
            .then((result) => {
                debugger
                if (result.error) {
                    debugger
                    console.log(error);
                } else {
                    createSubscription({
                        customerId: 'cus_HRApX3KZ7BQi7N',
                        paymentMethodId: result.paymentMethod.id,
                        priceId: 'price_1GsIS0Hf9HxLNSpK3jw34nx2',
                    });
                }
            });
    };

    function createSubscription({ customerId, paymentMethodId, priceId }) {
        return (
            fetch('http://localhost:8085/create-subscription', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    paymentMethodId,
                    priceId,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                // If the card is declined, display an error to the user.
                .then((result) => {
                    if (result.error) {
                        // The card had an error when trying to attach it to a customer.
                        throw result;
                    }
                    return result;
                })
                // Normalize the result to contain the object returned by Stripe.
                // Add the addional details we need.
                .then((result) => {
                    return {
                        paymentMethodId: paymentMethodId,
                        priceId: priceId,
                        subscription: result,
                    };
                })
                // Some payment methods require a customer to be on session
                // to complete the payment process. Check the status of the
                // payment intent to handle these actions.
                .then(handlePaymentThatRequiresCustomerAction => {

                })
                // If attaching this card to a Customer object succeeds,
                // but attempts to charge the customer fail, you
                // get a requires_payment_method error.
                .then(handleRequiresPaymentMethod => {

                })
                // No more actions required. Provision your service for the user.
                .then(onSubscriptionComplete => {

                })
                .catch((error) => {
                    // An error has happened. Display the failure to the user here.
                    // We utilize the HTML element we created.
                    console.log(error);
                })
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div class="form-row">
                <label for="card-element">
                    Credit or debit card
                </label>
                <CardElement
                    id="card-element"
                    options={CARD_ELEMENT_OPTIONS}
                    onChange={handleChange}
                />
                <div className="card-errors" role="alert">{error}</div>
            </div>
            <button type="submit">Submit Payment</button>
        </form>
    );
}

export default CheckoutForm