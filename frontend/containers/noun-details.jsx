import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

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
    this.props.fetchEntity({
      id: window.location.pathname.split("/")[2],
      directory: window.location.pathname.split("/")[1],
      entityName: this.props.entityName
    }).then(() => {
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
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.noun,
        entityName: 'noun'
      }).then(() => {
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
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'englishPlural' }) }
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
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'foreign', columnHeader: 'Hindi' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'foreignPlural', columnHeader: 'Hindi Plural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'transliteratedPlural' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
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
    noun: reducers.standardReducer.entity,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NounDetails);
