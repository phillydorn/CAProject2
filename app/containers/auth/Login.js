import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login, verify } from '../../actions/auth/auth';


class LoginContainer extends Component {

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this.state = {
      username: '',
      password: '',
    }
  }

  componentWillMount() {
    this.props.verify();
  }

 
  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      this.router.push('/');
    }
  }

  handleChange(e) {
    const { id, value } = e.target;
    this.setState({[id]: value});
  }


  handleSubmit(e) {
    e.preventDefault();
    const { username, password} = this.state;
    this.props.login({username, password});
  }

  render () {

    const { username, password } = this.state;

    return (
      <div>
        <form noValidate className="signup-form" onSubmit = {this.handleSubmit.bind(this)}>
          <h1>Login</h1>
          <label>username</label>
          <input type="text" placeholder="username" id="username" onChange={this.handleChange.bind(this)} value={username}/>
          <label>Password</label>
          <input type="password" placeholder="password" id="password" onChange={this.handleChange.bind(this)} value={password} />
          <input type="submit" />
        </form>
      </div>
    );
  }
};
function mapStateToProps(state) {
  const { loggedIn } = state.auth.toJS();
  return { loggedIn };
}

LoginContainer.propTypes = {
  login: PropTypes.func,
};

LoginContainer.contextTypes = {
  router: PropTypes.object,
};

export { LoginContainer };
export default connect(mapStateToProps, { login, verify })(LoginContainer);
