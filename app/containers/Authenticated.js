import React, { Component, PropTypes }  from 'react';
import { connect } from 'react-redux';
import { verify } from '../actions/auth/auth';



const Authenticated = function(RequestComponent) {
  class AuthenticatedComponent extends Component {

    // static fetchData() {
    //   this.props.verify();
    // }

    constructor(props, context) {
      super(props);
      this.router = context.router;
    }

    componentWillMount() {
      this.props.verify();
    }

    componentWillReceiveProps(nextProps) {
    //   if (!nextProps.loggedIn) {
    //     this.router.push('/login');
    //   }
    }

    render() {
      if (this.props.loggedIn) {
        return (
          <RequestComponent params={this.props.params} loggedIn={this.props.loggedIn} />
          )
      }
      return <div className="unauthenticated">
        <h2>Please login or signup.</h2>
      </div>
    }

    };

  return connect(mapStateToProps, { verify })(AuthenticatedComponent);
}

function mapStateToProps(state) {
  const { loggedIn } = state.auth.toJS();
  return { loggedIn };
}

Authenticated.propTypes = {
  verify: PropTypes.func,
};

Authenticated.contextTypes = {
  router: PropTypes.object,
};

export default Authenticated;
