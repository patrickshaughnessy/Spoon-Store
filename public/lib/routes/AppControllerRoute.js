
import Relay from 'react-relay';

export default class extends Relay.Route {
  static path = '/';
  static queries = {
    spoons: () => Relay.QL`query { spoons }`,
  };
  static routeName = 'AppControllerRoute';
}
