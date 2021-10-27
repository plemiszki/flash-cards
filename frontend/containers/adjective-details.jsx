import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

class AdjectiveDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyAdjective = {
      english: '',
      englishSaved: '',
      masculine: '',
      masculineSaved: '',
      feminine: '',
      feminineSaved: ''
    };

    this.state = {
      fetching: true,
      adjective: emptyAdjective,
      adjectiveSaved: emptyAdjective,
      errors: [],
      adjectiveTags: [],
      tags: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'adjective').then(() => {
      this.setState({
        fetching: false,
        adjective: this.props.adjective,
        adjectiveSaved: HandyTools.deepCopy(this.props.adjective),
        tags: this.props.tags,
        adjectiveTags: this.props.adjectiveTags,
        changesToSave: false
      }, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
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
    return !HandyTools.objectsAreEqual(this.state.adjective, this.state.adjectiveSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entityName: 'adjective',
        entity: this.state.adjective
      }).then(() => {
        this.setState({
          fetching: false,
          adjective: this.props.adjective,
          adjectiveSaved: HandyTools.deepCopy(this.props.adjective),
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
      <div id="adjective-details" className="component details-component">
        <h1>Adjective Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'english' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'masculinePlural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedMasculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedFeminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'transliteratedMasculinePlural' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width m-bottom" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
          <hr className="divider" />
          { EntityTags.renderTags.call(this, 'adjective') }
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, createEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdjectiveDetails);
