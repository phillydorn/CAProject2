
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Nav from '../components/nav/Nav';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { path: this.trimPath(props.location.pathname) };
  }


  componentWillReceiveProps(nextProps) {
    this.setState({ path: this.trimPath(nextProps.location.pathname) });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({ path: this.trimPath(nextProps.location.pathname) });
    }
  }

  trimPath(pathString) {
    const re = /^\//;
    return pathString.replace(re, '');
  }

  render() {
    return (
      <div>
       
        <Nav className="nav" path={this.state.path} />

        {this.props.children}
      </div>
    );
  }
}


App.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object,
};

function mapStateToProps(state) {
  // const { modal, spinner } = state.auth.toJS();
  return { };
}
export { App };
export default connect(mapStateToProps, { })(App);
