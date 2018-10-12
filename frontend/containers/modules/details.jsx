import React, { Component } from 'react';
import HandyTools from 'handy-tools';

export default {

  renderField(args) {
    let columnHeader = args.columnHeader || HandyTools.capitalize(args.property);
    return(
      <div className={ `col-xs-${args.columnWidth}` }>
        <h2>{ columnHeader }</h2>
        <input className={ HandyTools.errorClass(this.state.errors, Errors[args.property]) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state[args.entity][args.property] || "" } data-entity={ args.entity } data-field={ args.property } />
        { HandyTools.renderFieldError(this.state.errors, Errors[args.property]) }
      </div>
    );
  },

  saveButtonText() {
    return this.state.changesToSave ? 'Save' : (this.state.justSaved ? 'Saved' : 'No Changes');
  },

  clickDelete() {
    this.setState({
      fetching: true
    });
    let urlSections = window.location.pathname.split("/");
    this.props.standardDelete(urlSections[1], urlSections[2]);
  }
}
