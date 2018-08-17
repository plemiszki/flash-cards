import React, { Component } from 'react';
import HandyTools from 'handy-tools';

export default class NounDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      noun: {
        english: '',
        englishPlural: '',
        foreign: '',
        foreignPlural: '',
        gender: ''
      },
      nounSaved: {
        english: '',
        englishPlural: '',
        foreign: '',
        foreignPlural: '',
        gender: ''
      },
      errors: []
    };
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !HandyTools.objectsAreEqual(this.state.noun, this.state.nounSaved);
  }

  clickSave() {
    console.log('save!');
  }

  clickDelete() {
    console.log('delete!');
  }

  render() {
    return (
      <div id="noun-details" className="component details-component">
        <h1>Noun Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            <div className="col-xs-4">
              <h2>English</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.english) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.english } data-entity="noun" data-field="english" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
          </div>
          <div>
            <a className={ "btn orange-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              Save
            </a>
            <a className={ "btn delete-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ this.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}
