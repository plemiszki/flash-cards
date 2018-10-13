import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

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
        adjective: this.props.adjective,
        adjectiveSaved: HandyTools.deepCopy(this.props.adjective),
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
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'adjective', property: 'feminine' }) }
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
    adjective: reducers.standardReducer.entity,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AdjectiveDetails);
