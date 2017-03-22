import React from 'react';
import { eventAnalytics } from '../../utils/analytics';

const CallToAction = () => {
  const subscribeActions = () => {
    const dataObj = {
      event: true,
      category: '',
      action: '',
      pageTitle: window.location.pathname,
      subStatus: '',
    };
    eventAnalytics(dataObj);
  };

  return (
    <div className="cta-div" id="cta" onClick={subscribeActions} />
  );
};

CallToAction.propTypes = {

};

export default CallToAction;
