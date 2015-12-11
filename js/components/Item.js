import React from "react";
import Relay from 'react-relay';

import Purchase from './Purchase';

class Item extends React.Component{
  render(){
    let {title, description, price, mood, type} = this.props.spoon
    return(
      <div className="item">
        <h2>Title: {title}</h2>
        <h3>Description: {description}</h3>
        <h3>Type: {type}</h3>
        <h3>Mood: {mood}</h3>
        <h4>Price: {price}</h4>
        <Purchase spoon={this.props.spoon} />
      </div>
    )
  }
}

export default Item;
