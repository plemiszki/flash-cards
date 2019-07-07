import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ChangeCase from 'change-case'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { createEntity } from '../actions/index'

class NewEntity extends React.Component {
  constructor(props) {
    super(props);
    let obj = {
      fetching: false,
      [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity),
      errors: []
    };
    if (this.props.staticData) {
      Object.assign(obj, this.props.staticData);
    }
    this.state = obj;
  }

  componentDidMount() {
    HandyTools.setUpNiceSelect({ selector: '.admin-modal select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
  }

  clickAdd(e) {
    let entityNamePlural = this.props.entityNamePlural || `${this.props.entityName}s`;
    e.preventDefault();
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory: HandyTools.convertToUnderscore(entityNamePlural),
      entityName: this.props.entityName,
      entity: this.state[this.props.entityName]
    }, entityNamePlural).then(() => {
      if (this.props.redirect) {
        window.location.pathname = `/${directory}/${this.props[this.props.entityName].id}`;
      } else {
        this.props.callback(this.props[this.props.responseKey || entityNamePlural]);
      }
    }, () => {
      this.setState({
        fetching: false,
        errors: this.props.errors
      });
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors
    }
  }

  render() {
    return(
      <div className="component admin-modal">
        <form className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          { this.renderFields() }
          <input type="submit" className={ "blue-button" + Common.renderDisabledButtonClass(this.state.fetching) } value={ this.props.buttonText || `Add ${ChangeCase.titleCase(this.props.entityName)}` } onClick={ this.clickAdd.bind(this) } />
        </form>
      </div>
    );
  }

  renderFields() {
    switch (this.props.entityName) {
      case 'noun':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'englishPlural' }) }
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.gender } data-entity="noun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { Details.renderDropdownFieldError([], []) }
            </div>
          </div>,
          <div key="2" className="row">
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'foreign', columnHeader: 'Hindi' }) }
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'foreignPlural', columnHeader: 'Hindi Plural' }) }
          </div>,
          <div key="3" className="row">
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'transliteratedPlural' }) }
          </div>
        ]);
      case 'verb':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'infinitive' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'transliteratedInfinitive' }) }
          </div>
        ]);
      case 'adjective':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'english' }) }
          </div>,
          <div key="2" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'masculinePlural' }) }
          </div>,
          <div key="3" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedMasculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedFeminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedMasculinePlural' }) }
          </div>
        ]);
      case 'adverb':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'foreign' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'english' }) }
          </div>
        ]);
      case 'card':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'card', property: 'question' }) }
          </div>,
          <div key="2" className="row">
            { Details.renderTextBox.bind(this)({ rows: 5, columnWidth: 12, entity: 'card', property: 'answer' }) }
          </div>
        ]);
      case 'tag':
      case 'quiz':
      case 'question':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: this.props.entityName, property: 'name' }) }
          </div>
        ]);
      case 'quizQuestion':
        return(
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'quizQuestion', property: 'questionId', columnHeader: 'Question', customType: 'modal', modalDisplayProperty: 'name' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'quizQuestion', property: 'tagId', columnHeader: 'Tag', customType: 'modal', modalDisplayProperty: 'name', noneOption: true }) }
            { Details.renderField.bind(this)({ columnWidth: 2, entity: 'quizQuestion', property: 'amount' }) }
          </div>
        );
      case 'cardTag':
        return(
          <div className="row">
            { Details.renderDropDown.bind(this)({ columnWidth: 12, entity: 'cardTag', property: 'tagId', columnHeader: 'Tag', options: this.props.array1, optionDisplayProperty: 'name', maxOptions: 2 }) }
          </div>
        );
      case 'spanishNoun':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'englishPlural' }) }
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.spanishNoun.gender } data-entity="spanishNoun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { Details.renderDropdownFieldError([], []) }
            </div>
          </div>,
          <div key="2" className="row">
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'spanishNoun', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'spanishNoun', property: 'spanishPlural' }) }
          </div>
        ]);
      case 'spanishVerb':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishVerb', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishVerb', property: 'english' }) }
          </div>
        ]);
      case 'spanishAdjective':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishAdjective', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishAdjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishAdjective', property: 'masculinePlural' }) }
          </div>,
          <div key="2" className="row">
            <div className="col-xs-4"></div>
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishAdjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishAdjective', property: 'femininePlural' }) }
          </div>
        ]);
      case 'matchBin':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'matchBin', property: 'name' }) }
          </div>
        ]);
      case 'matchItem':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'matchItem', property: 'name' }) }
          </div>
        ]);
    }
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntity);
