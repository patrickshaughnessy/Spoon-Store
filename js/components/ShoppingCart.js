
import React from "react";
import Relay from 'react-relay';

class ShoppingCart extends React.Component{
  render(){
    let items = localStorage.items;
    return(
      <div className="shoppingCart">
        <h3>Total Items: {items ? items.length : 0}</h3>
        <h3>Total Cost: {items ? items.length : 0}</h3>
      </div>
    )
  }
}

export default ShoppingCart;
