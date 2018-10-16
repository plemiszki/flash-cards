import React, { Component } from 'react';
import HandyTools from 'handy-tools';
import MatchHeight from 'jquery-match-height';

export default {

  clickDelete() {
    this.setState({
      fetching: true
    });
    let urlSections = window.location.pathname.split('/');
    this.props.deleteEntity(urlSections[1], urlSections[2]);
  },

  fetchEntity() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }).then(() => {
      this.setState({
        fetching: false,
        [this.props.entityName]: this.props[this.props.entityName],
        [`${this.props.entityName}Saved`]: HandyTools.deepCopy(this.props[this.props.entityName]),
        changesToSave: false
      }, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  },

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

  updateEntity() {
    let entityName = this.props.entityName;
    this.props.updateEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: entityName,
      entity: this.state[entityName]
    }).then(() => {
      let savedEntity = this.props[entityName];
      this.setState({
        fetching: false,
        [entityName]: savedEntity,
        [`${entityName}Saved`]: HandyTools.deepCopy(savedEntity),
        changesToSave: false
      });
    }, () => {
      this.setState({
        fetching: false,
        errors: this.props.errors
      });
    });
  }
}
