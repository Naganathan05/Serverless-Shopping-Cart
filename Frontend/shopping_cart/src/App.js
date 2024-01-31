// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";

const Home = () => {
  useEffect(() => {
    // Function to invoke the Lambda function for creating a cookie
    const invokeLambdaFunction = async () => {
      try {
        // Replace 'lambda-api-endpoint' with the actual endpoint of your Lambda function
        const response = await fetch('https://2n9yl78q9e.execute-api.us-east-1.amazonaws.com/Dev', {
          method: 'POST', // Assuming your Lambda function is triggered via POST
        });

        // Handle the response, if needed
        const data = await response.json();
        console.log('Lambda function response:', data);
      } catch (error) {
        console.error('Error invoking Lambda function:', error);
      }
    };

    // Call the function to invoke the Lambda function
    invokeLambdaFunction();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts
  return (
    <div>
      <h1>Welcome to My Cart App</h1>
      <Link to="/cart">
        <button>View Cart</button>
      </Link>
    </div>
  );
};

// Cart component

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('https://t9mvnt4dra.execute-api.us-east-1.amazonaws.com/Devop/cart');
        const data = await response.json();

        // Check if data is an array before setting state
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          console.error('Invalid data format. Expected an array:', data);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  // Check if cartItems is an array before rendering
  if (!Array.isArray(cartItems)) {
    return (
      <div>
        <h1>Error: Cart items data is not in the expected format.</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart Items</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};

export default App;
