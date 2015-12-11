
import React from "react";
import Relay from 'react-relay';

import Item from './Item';
import Purchase from './Purchase';

class AppController extends React.Component{
  render(){
    return(
      <div className="app">
        <h1>Hello World!</h1>
        {this.props.store.spoons.edges.map(spoon => {
          return <Item key={spoon.node._id} spoon={spoon.node} />
        })}
      </div>
    )
  }
}

export default Relay.createContainer(AppController, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        spoons(first: 10) {
          edges {
            node {
              _id
              title,
              price,
              description,
              mood,
              type
            }
          }
        }
      }
    `
  }
})
