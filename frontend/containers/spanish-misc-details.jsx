import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HandyTools from 'handy-tools'
import { Common, Details } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

class SpanishMiscDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishMisc = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: ''
    };

    this.state = {
      fetching: true,
      spanishMisc: emptySpanishMisc,
      spanishMiscSaved: emptySpanishMisc,
      errors: [],
      spanishMiscTags: [],
      tags: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'spanishMisc').then(() => {
      this.setState({
        fetching: false,
        spanishMisc: this.props.spanishMisc,
        spanishMiscSaved: HandyTools.deepCopy(this.props.spanishMisc),
        tags: this.props.tags,
        spanishMiscTags: this.props.spanishMiscTags,
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
    return !HandyTools.objectsAreEqual(this.state.spanishMisc, this.state.spanishMiscSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, () => {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.spanishMisc,
        entityName: 'spanishMisc'
      }).then(() => {
        this.setState({
          fetching: false,
          spanishMisc: this.props.spanishMisc,
          spanishMiscSaved: HandyTools.deepCopy(this.props.spanishMisc),
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
        <h1>Spanish Misc Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishMisc', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishMisc', property: 'english' }) }
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
          { EntityTags.renderTags.call(this, 'spanishMisc') }
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

export default connect(mapStateToProps, mapDispatchToProps)(SpanishMiscDetails);
