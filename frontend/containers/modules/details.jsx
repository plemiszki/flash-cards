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
      let newState = {
        fetching: false,
        [this.props.entityName]: this.props[this.props.entityName],
        [`${this.props.entityName}Saved`]: HandyTools.deepCopy(this.props[this.props.entityName]),
        changesToSave: false
      };
      if (this.props.array1Name) {
        Object.assign(newState, { [this.props.array1Name]: this.props[this.props.array1Name] });
      }
      if (this.props.array2Name) {
        Object.assign(newState, { [this.props.array2Name]: this.props[this.props.array2Name] });
      }
      if (this.props.array3Name) {
        Object.assign(newState, { [this.props.array3Name]: this.props[this.props.array3Name] });
      }
      this.setState(newState, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  },

  renderDropDown(args) {
    let columnHeader = args.columnHeader || HandyTools.capitalize(args.property);
    return(
      <div className={ `col-xs-${args.columnWidth} ` + (args.maxOptions ? `select-scroll-${args.maxOptions}` : 'select-scroll-6') }>
        <h2>{ columnHeader }</h2>
        <select className={ HandyTools.errorClass(this.state.errors, Errors[args.property] || []) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state[args.entity][args.property] || "" } data-entity={ args.entity } data-field={ args.property }>
          { HandyTools.alphabetizeArrayOfObjects(args.options, 'name').map((option, index) => {
            return(
              <option key={ index } value={ args.optionValueProperty || option.id }>
                { option[args.optionDisplayProperty] }
              </option>
            );
          })}
        </select>
        { HandyTools.renderFieldError(this.state.errors, Errors[args.property] || []) }
      </div>
    );
  },

  renderField(args) {
    let columnHeader = args.columnHeader || HandyTools.capitalize(args.property);
    return(
      <div className={ `col-xs-${args.columnWidth}` }>
        <h2>{ columnHeader }</h2>
        <input className={ HandyTools.errorClass(this.state.errors, Errors[args.property] || []) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state[args.entity][args.property] || "" } data-entity={ args.entity } data-field={ args.property } />
        { HandyTools.renderFieldError(this.state.errors, Errors[args.property] || []) }
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
