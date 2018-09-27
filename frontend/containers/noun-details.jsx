import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchNoun, updateNoun, standardDelete } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.js';

class NounDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyNoun = {
      english: '',
      englishSaved: '',
      foreign: '',
      foreignSaved: '',
      transliterated: '',
      transliteratedSaved: ''
    };

    this.state = {
      fetching: true,
      noun: emptyNoun,
      nounSaved: emptyNoun,
      errors: []
    };
  }

  componentDidMount() {
    this.props.fetchNoun(window.location.pathname.split("/")[2]).then(() => {
      this.setState({
        fetching: false,
        noun: this.props.noun,
        nounSaved: HandyTools.deepCopy(this.props.noun),
        changesToSave: false
      }, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
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
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateNoun(window.location.pathname.split("/")[2], this.state.noun).then(() => {
        this.setState({
          fetching: false,
          noun: this.props.noun,
          nounSaved: HandyTools.deepCopy(this.props.noun),
          changesToSave: false
        });
      }, () => {
        this.setState({
          fetching: false,
          errors: this.props.errors
        });
      });
    });
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
              <input className={ HandyTools.errorClass(this.state.errors, Errors.english) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.english || "" } data-entity="noun" data-field="english" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
            <div className="col-xs-4">
              <h2>English Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.englishPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.englishPlural || "" } data-entity="noun" data-field="englishPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.gender } data-entity="noun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { HandyTools.renderFieldError([], []) }
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <h2>Hindi</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.foreign) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.foreign || "" } data-entity="noun" data-field="foreign" />
              { HandyTools.renderFieldError(this.state.errors, Errors.foreign) }
            </div>
            <div className="col-xs-4">
              <h2>Hindi Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.foreignPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.foreignPlural || "" } data-entity="noun" data-field="foreignPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.foreignPlural) }
            </div>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <h2>Transliterated</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.transliterated) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.transliterated || "" } data-entity="noun" data-field="transliterated" />
              { HandyTools.renderFieldError(this.state.errors, Errors.transliterated) }
            </div>
            <div className="col-xs-4">
              <h2>Transliterated Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.transliteratedPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.transliteratedPlural || "" } data-entity="noun" data-field="transliteratedPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.transliteratedPlural) }
            </div>
          </div>
          <div>
            <a className={ "btn orange-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return {
    fetching: reducers.nounsReducer.fetching,
    noun: reducers.nounsReducer.noun,
    errors: reducers.nounsReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchNoun, updateNoun, standardDelete }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NounDetails);
