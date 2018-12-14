import React, { Component } from 'react';

class Message extends React.Component {

  render() {
    return(
      <div className={ `message-box${ this.props.color ? ` ${this.props.color}` : ''}` }>
        <div className="message-close" onClick={ this.props.clickClose }></div>
        { this.props.text }
      </div>
    );
  }
}

export default Message;
