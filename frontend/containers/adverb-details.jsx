import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

class AdverbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyAdverb = {
      english: '',
      englishSaved: '',
      transliterated: '',
      transliteratedSaved: '',
      foreign: '',
      foreignSaved: ''
    };

    this.state = {
      fetching: true,
      adverb: emptyAdverb,
      adverbSaved: emptyAdverb,
      errors: []
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }).then(() => {
      this.setState({
        fetching: false,
        adverb: this.props.adverb,
        adverbSaved: HandyTools.deepCopy(this.props.adverb),
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
    return !HandyTools.objectsAreEqual(this.state.adverb, this.state.adverbSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entityName: 'adverb',
        entity: this.state.adverb
      }).then(() => {
        this.setState({
          fetching: false,
          adverb: this.props.adverb,
          adverbSaved: HandyTools.deepCopy(this.props.adverb),
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
      <div id="adverb-details" className="component details-component">
        <h1>Adverb Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'foreign' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adverb', property: 'english' }) }
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
    adverb: reducers.standardReducer.entity,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdverbDetails);
