import React, { Component } from 'react';

class Message extends React.Component {

  render() {
    let lines = this.props.text.split("\n");
    return(
      <div className={ `message-box${ this.props.color ? ` ${this.props.color}` : ''}` }>
        <div className="message-close" onClick={ this.props.clickClose }></div>
        { lines.map((line, index) => {
          return(
            <p key={ index }>{ line }</p>
          );
        }) }
      </div>
    );
  }
}

export default Message;
