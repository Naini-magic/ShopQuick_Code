import { useState , useEffect} from "react"
import React   from 'react'
import {loadStripe} from "@stripe/stripe-js"

const Right = ({item}) => {

console.log(item);
  
  const [price , setPrice] = useState(0);

  useEffect(() => {
    totalAmount();
  },[item]);


  const totalAmount = () => {
    let price = 0 ;
    item.map((item) => {
      price += item.price.cost
    });
    setPrice(price)
  }

  const makePayment = async () => {
     const stripe =  await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY
     )


     const body = { 
      products : item
     }

     const headers = {
      "Content-Type" : "application/json"
     }

     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }); 

     const session = await response.json();

     const result = stripe.redirectToCheckout({
      sessionId:session.id
     });

     if(result.error){
      console.log(result.error);
     }
  }

  return (
    <div className='right_buy'>
       <div className='cost_right'>
            <p>Your order is eligible for FREE Delivery</p>
            <span style={{color:"595959"}}>Select this option at checkout</span>

            <h3>Subtotal ({item.length} item) :<span style={{fontWeight:700}}>${price}</span> </h3>
            <button 
            onClick={makePayment}
            className='rightbuy_btn'>Process to Buy</button>
            <div className='emi'>Emi available</div>
        </div>
    </div>
  )
}

export default Right;