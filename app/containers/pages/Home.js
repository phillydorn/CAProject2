
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';



class HomeContainer extends Component {
  // static fetchData({ store }) {
  //   return store.dispatch(loadHomeFeed());
  // }

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
   
    // this.props.loadHomeFeed();
  }


  render() {

    return (
      <div className="home-feed">
        
      </div>
    );
  }
}


function mapStateToProps(state) {
  // const {  } = state.home.toJS();
  return {  };
}

HomeContainer.propTypes = {
};

export { HomeContainer };
export default connect(mapStateToProps, {  })(HomeContainer);
