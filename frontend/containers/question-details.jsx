import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

class QuestionDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyQuestion = {
      name: ''
    };

    this.state = {
      fetching: true,
      question: emptyQuestion,
      questionSaved: emptyQuestion,
      errors: []
    };
  }

  componentDidMount() {
    Details.fetchEntity.bind(this)();
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !HandyTools.objectsAreEqual(this.state.question, this.state.questionSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      Details.updateEntity.bind(this)();
    });
  }

  render() {
    return (
      <div id="question-details" className="component details-component">
        <h1>Question Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'question', property: 'name' }) }
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
    question: reducers.standardReducer.entity,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDetails);
