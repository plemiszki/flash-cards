import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HandyTools from 'handy-tools'
import { Common, Details } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

class SpanishAdjectiveDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishAdjective = {
      english: '',
      masculine: '',
      masculinePlural: '',
      feminine: '',
      femininePlural: ''
    };

    this.state = {
      fetching: true,
      spanishAdjective: emptySpanishAdjective,
      spanishAdjectiveSaved: emptySpanishAdjective,
      errors: [],
      spanishAdjectiveTags: [],
      tags: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'spanishAdjective').then(() => {
      this.setState({
        fetching: false,
        spanishAdjective: this.props.spanishAdjective,
        spanishAdjectiveSaved: HandyTools.deepCopy(this.props.spanishAdjective),
        tags: this.props.tags,
        spanishAdjectiveTags: this.props.spanishAdjectiveTags,
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
    return !HandyTools.objectsAreEqual(this.state.spanishAdjective, this.state.spanishAdjectiveSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, () => {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.spanishAdjective,
        entityName: 'spanishAdjective'
      }).then(() => {
        this.setState({
          fetching: false,
          spanishAdjective: this.props.spanishAdjective,
          spanishAdjectiveSaved: HandyTools.deepCopy(this.props.spanishAdjective),
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
        <h1>Spanish Adjective Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'english' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'masculinePlural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'femininePlural' }) }
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
          { EntityTags.renderTags.call(this, 'spanishAdjective') }
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

export default connect(mapStateToProps, mapDispatchToProps)(SpanishAdjectiveDetails);
