import React from "react";

import PaymentActions from '../actions/PaymentActions';
import PaymentStore from '../stores/PaymentStore';

let _returnConfirmation = () => {
  return { charge: PaymentStore.returnConfirmation()}
}

class Purchase extends React.Component{
  constructor(props){
    super(props);
    this.state = _returnConfirmation();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount(){
    PaymentStore.startListening(this._onChange);
  }

  componentWillUnmount(){
    PaymentStore.stopListening(this._onChange);
  }

  _onChange() {
    console.log('5. store emitted change event');
    this.setState(_returnConfirmation());
  }

  handleClick(e){
    e.preventDefault();
    var handler = StripeCheckout.configure({
      key: 'pk_test_XsChXUjkE5asWIozOmwkZRx6',
      image: '/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        console.log('token', token);
        PaymentActions.makePayment(token);
      }
    });
    // Open Checkout with further options
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount: 2000
    });
  }
  render(){
    var paymentConfirmation = this.state.charge;
    var paid;
    var amount;
    var description;

    if (paymentConfirmation){
      paid = this.state.charge.paid;
      amount = this.state.charge.amount;
      description = this.state.charge.description;
      return(
        <div className="purchase">
          <h3>Thank You!</h3>
          <h4>Your payment of ${amount} for {description} has been completed successfully</h4>
        </div>
      )
    } else {
      return(
        <div className="purchase">
          <button onClick={this.handleClick.bind(this)}>Purchase</button>
        </div>
      )
    }

  }
}

export default Purchase
