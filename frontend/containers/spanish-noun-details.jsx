import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HandyTools from 'handy-tools'
import { Common, Details } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

class SpanishNounDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishNoun = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: '',
      note: ''
    };

    this.state = {
      fetching: true,
      spanishNoun: emptySpanishNoun,
      spanishNounSaved: emptySpanishNoun,
      errors: [],
      spanishNounTags: [],
      tags: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'spanishNoun').then(() => {
      this.setState({
        fetching: false,
        spanishNoun: this.props.spanishNoun,
        spanishNounSaved: HandyTools.deepCopy(this.props.spanishNoun),
        tags: this.props.tags,
        spanishNounTags: this.props.spanishNounTags,
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
    return !HandyTools.objectsAreEqual(this.state.spanishNoun, this.state.spanishNounSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, () => {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.spanishNoun,
        entityName: 'spanishNoun'
      }).then(() => {
        this.setState({
          fetching: false,
          spanishNoun: this.props.spanishNoun,
          spanishNounSaved: HandyTools.deepCopy(this.props.spanishNoun),
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
      <div id="spanish-noun-details" className="component details-component">
        <h1>Spanish Noun Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'englishPlural' }) }
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.spanishNoun.gender } data-entity="spanishNoun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { Details.renderFieldError([], []) }
            </div>
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'spanishPlural' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'note' }) }
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
          { EntityTags.renderTags.call(this, 'spanishNoun') }
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

export default connect(mapStateToProps, mapDispatchToProps)(SpanishNounDetails);
