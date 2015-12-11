import React from "react";
import Relay from 'react-relay';

class AddToCart extends React.Component{

  addToCart(e){
    let items = localStorage.items ? JSON.parse(localStorage.items) : []
    console.log('items', items);
    items.push(JSON.stringify(this.props.spoon));
    localStorage.setItem('items', JSON.stringify(items));
  }

  render(){
    return(
      <div className="addToCart">
        <button onClick={this.addToCart.bind(this)}>Add To Cart</button>
      </div>
    )
  }
}

export default AddToCart;
