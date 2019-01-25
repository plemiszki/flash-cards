import React, { Component } from 'react';
import HandyTools from 'handy-tools';
import MatchHeight from 'jquery-match-height';
import ChangeCase from 'change-case';

let Details = {

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

  getColumnHeader(args) {
    return args.columnHeader || ChangeCase.titleCase(args.property);
  },

  renderDropDown(args) {

    function renderNoneOption(args) {
      if (args.optional) {
        return(
          <option key={ -1 } value={ '' }>(None)</option>
        );
      }
    }

    function renderOptions(args) {
      if (args.boolean) {
        return([
          <option key={ 0 } value={ "t" }>Yes</option>,
          <option key={ 1 } value={ "f" }>No</option>
        ]);
      } else {
        { return HandyTools.alphabetizeArrayOfObjects(args.options, args.optionDisplayProperty).map((option, index) => {
          return(
            <option key={ index } value={ args.optionValueProperty || option.id }>
              { option[args.optionDisplayProperty] }
            </option>
          );
        })}
      }
    }

    let columnHeader = Details.getColumnHeader(args);
    return(
      <div className={ `col-xs-${args.columnWidth} ` + (args.maxOptions ? `select-scroll-${args.maxOptions}` : 'select-scroll-6') }>
        <h2>{ columnHeader }</h2>
        <select className={ HandyTools.errorClass(this.state.errors, Errors[args.property] || []) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ HandyTools.convertBooleanToTFString(this.state[args.entity][args.property]) || "" } data-entity={ args.entity } data-field={ args.property }>
          { renderNoneOption(args) }
          { renderOptions(args) }
        </select>
        { HandyTools.renderDropdownFieldError(this.state.errors, Errors[args.property] || []) }
      </div>
    );
  },

  renderField(args) {
    let columnHeader = Details.getColumnHeader(args);
    return(
      <div className={ `col-xs-${args.columnWidth}` }>
        <h2>{ columnHeader }</h2>
        <input className={ HandyTools.errorClass(this.state.errors, Errors[args.property] || []) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state[args.entity][args.property] || "" } data-entity={ args.entity } data-field={ args.property } />
        { HandyTools.renderFieldError(this.state.errors, Errors[args.property] || []) }
      </div>
    );
  },

  renderTextBox(args) {
    let columnHeader = Details.getColumnHeader(args);
    return(
      <div className={ `col-xs-${args.columnWidth}` }>
        <h2>{ columnHeader }</h2>
        <textarea rows={ args.rows } className={ HandyTools.errorClass(this.state.errors, Errors[args.property] || []) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state[args.entity][args.property] || "" } data-entity={ args.entity } data-field={ args.property }></textarea>
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

export default Details;
