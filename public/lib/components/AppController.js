
import React from "react";
import Relay from 'react-relay';

import Purchase from './Purchase';

class AppController extends React.Component{
  render(){

    return(
      <div className="app">
        <h1>Hello World!</h1>
        {this.props.spoons.map(spoon => {
          return <Item key={spoon._id} spoon={spoon} />
        })}
      </div>
    )
  }
}

export default Relay.createContainer(AppController, {
  fragments: {
    spoons: () => Relay.QL`
      {
        spoons {
          _id,
          title,
          price,
        }
      }
    `
  }
})
