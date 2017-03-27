"use strict";

import React, {Component, PropTypes }  from 'react';


class Message extends Component {

  render() {
    return (
        <li className ="message">
          <p className = "message-user">{this.props.username}:</p>
          <p className="message-content">{this.props.content}</p>
        </li>
      )
  }
};

export default Message;
