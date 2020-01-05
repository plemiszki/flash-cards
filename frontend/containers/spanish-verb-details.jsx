import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HandyTools from 'handy-tools'
import { Common, Details } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

class SpanishVerbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishVerb = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: ''
    };

    this.state = {
      fetching: true,
      spanishVerb: emptySpanishVerb,
      spanishVerbSaved: emptySpanishVerb,
      errors: [],
      spanishVerbTags: [],
      tags: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'spanishVerb').then(() => {
      this.setState({
        fetching: false,
        spanishVerb: this.props.spanishVerb,
        spanishVerbSaved: HandyTools.deepCopy(this.props.spanishVerb),
        tags: this.props.tags,
        spanishVerbTags: this.props.spanishVerbTags,
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
    return !HandyTools.objectsAreEqual(this.state.spanishVerb, this.state.spanishVerbSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, () => {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.spanishVerb,
        entityName: 'spanishVerb'
      }).then(() => {
        this.setState({
          fetching: false,
          spanishVerb: this.props.spanishVerb,
          spanishVerbSaved: HandyTools.deepCopy(this.props.spanishVerb),
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
      <div id="spanish-verb-details" className="component details-component">
        <h1>Spanish Verb Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishVerb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishVerb', property: 'spanish' }) }
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
          { EntityTags.renderTags.call(this, 'spanishVerb') }
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

export default connect(mapStateToProps, mapDispatchToProps)(SpanishVerbDetails);
