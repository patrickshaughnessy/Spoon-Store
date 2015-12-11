import React from "react";

import Purchase from './Purchase';

class Item extends React.Component{
  render(){
    

    return(
      <div className="item">
        <h2>{title}</h2>
        <h3>{price}</h3>
        <Purchase description={title} price={price} />
      </div>
    )
  }
}

export default Item
