import React from "react";
import Relay from 'react-relay';

import Purchase from './Purchase';

class Item extends React.Component{
  render(){
    console.log(this.props.spoon);
    var title = this.props.spoon.title;
    var price = this.props.spoon.price;

    return(
      <div className="item">
        <h2>{title}</h2>
        <h3>{price}</h3>
        <Purchase description={title} price={price} />
      </div>
    )
  }
}

export default Item;
