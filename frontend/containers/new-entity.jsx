import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createEntity } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

class NewEntity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity),
      errors: []
    };
  }

  componentDidMount() {
    HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
  }

  clickAdd(e) {
    e.preventDefault();
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory: HandyTools.convertToUnderscore(this.props.entityNamePlural),
      entityName: this.props.entityName,
      entity: this.state[this.props.entityName]
    }).then(() => {
      this.setState({
        fetching: false,
        [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity)
      });
      this.props.callback(this.props.entities);
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
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          { this.renderFields() }
          <input type="submit" className={ "blue-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } value={ this.props.buttonText || `Add ${HandyTools.capitalize(this.props.entityName)}` } onClick={ this.clickAdd.bind(this) } />
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
              <select onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.gender } data-entity="noun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { HandyTools.renderDropdownFieldError([], []) }
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
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'transliteratedInfinitive' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'infinitive' }) }
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
            { Details.renderDropDown.bind(this)({ columnWidth: 6, entity: 'quizQuestion', property: 'questionId', columnHeader: 'Question', options: this.props.array1, optionDisplayProperty: 'name', maxOptions: 2 }) }
            { Details.renderDropDown.bind(this)({ columnWidth: 4, entity: 'quizQuestion', property: 'tagId', columnHeader: 'Tag', options: this.props.array2, optionDisplayProperty: 'name', maxOptions: 2, optional: true }) }
            { Details.renderField.bind(this)({ columnWidth: 2, entity: 'quizQuestion', property: 'amount' }) }
          </div>
        );
      case 'cardTag':
        return(
          <div className="row">
            { Details.renderDropDown.bind(this)({ columnWidth: 12, entity: 'cardTag', property: 'tagId', columnHeader: 'Tag', options: this.props.array1, optionDisplayProperty: 'name', maxOptions: 2 }) }
          </div>
        );
    }
  }
}

const mapStateToProps = (reducers) => {
  return {
    entities: reducers.standardReducer.entities,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntity);