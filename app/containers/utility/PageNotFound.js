
'use strict';


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PageNotFound from '../../components/utility/PageNotFound';


class PageNotFoundContainer extends Component {

  constructor(props, context) {
    super(props);
    this.router = context.router;
    this.state = {
      listings: [],
    };
  }



  render() {
    const { listings } = this.state;

    const latest = listings.filter((result) => {
      return result.content_type.name === 'Page';
    });

    return (
      <div className="page-not-found-page">
        <PageNotFound listings={_.slice(latest, 0, 5)} />
      </div>
    );
  }
}

PageNotFoundContainer.propTypes = {
};

PageNotFoundContainer.contextTypes = {
  router: PropTypes.object,
};



export { PageNotFoundContainer };
export default connect(null, {  })(PageNotFoundContainer);
