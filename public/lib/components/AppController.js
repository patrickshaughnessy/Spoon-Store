import React from "react";

class AppController extends React.Component{
  constructor(props){
    super(props);
    this.state = {  }
  }

  handleClick(handler, e){
    console.log('handler', handler, e);

    e.preventDefault();
    // Open Checkout with further options
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });
  }
  render(){
    var handler = StripeCheckout.configure({
      key: 'pk_test_XsChXUjkE5asWIozOmwkZRx6',
      image: '/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        console.log('token', token);
        $.post('/', token)
          .done(function(data){
            console.log(data);
          })
          .fail(function(err){
            console.error(err);
          })
      }
    });
    return(
      <div className="app">
        <h1>Hello World!</h1>
        <button onClick={this.handleClick.bind(this, handler)}>Purchase</button>

      </div>
    )
  }
}

export default AppController
