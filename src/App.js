import React from 'react';
import './App.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './components/CheckoutForm';

const stripePromise = loadStripe("pk_test_A5PcSBPuttBxlVoU8oKrT0sB00aGj9p9xE");

function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
