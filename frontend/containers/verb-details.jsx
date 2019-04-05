import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index'

class VerbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyVerb = {
      english: '',
      englishSaved: '',
      infinite: '',
      infiniteSaved: '',
      postposition: ''
    };

    this.state = {
      fetching: true,
      verb: emptyVerb,
      verbSaved: emptyVerb,
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
        verb: this.props.verb,
        verbSaved: HandyTools.deepCopy(this.props.verb),
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
    return !HandyTools.objectsAreEqual(this.state.verb, this.state.verbSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateEntity({
        id: window.location.pathname.split("/")[2],
        directory: window.location.pathname.split("/")[1],
        entityName: 'verb',
        entity: this.state.verb
      }).then(() => {
        this.setState({
          fetching: false,
          verb: this.props.verb,
          verbSaved: HandyTools.deepCopy(this.props.verb),
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
      <div id="verb-details" className="component details-component">
        <h1>Verb Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'infinitive' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'transliteratedInfinitive' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'englishIrregularImperfective', columnHeader: 'English Irregular Imperfective' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'irregularImperativeInformal', columnHeader: 'Irregular Imperative - Informal' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'irregularImperativeInformalTransliterated', columnHeader: 'Transliterated Irregular Imperative - Informal' }) }
          </div>
          <div className="row">
            <div className="col-xs-2">
              <h2>Postposition</h2>
              <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.verb.postposition } data-entity="verb" data-field="postposition">
                <option value={ "" }>(None)</option>
                <option value={ "से" }>से</option>
                <option value={ "को" }>को</option>
              </select>
              { Details.renderFieldError([], []) }
            </div>
            { Details.renderField.bind(this)({ columnWidth: 2, entity: 'verb', property: 'englishPreposition', hidden: this.state.verb.postposition === "" }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'irregularImperativeFormal', columnHeader: 'Irregular Imperative - Formal' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'verb', property: 'irregularImperativeFormalTransliterated', columnHeader: 'Transliterated Irregular Imperative - Formal' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
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
    verb: reducers.standardReducer.entity,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VerbDetails);
