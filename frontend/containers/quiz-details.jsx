import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

class QuizDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyQuiz = {
      name: ''
    };

    this.state = {
      fetching: true,
      quiz: emptyQuiz,
      quizSaved: emptyQuiz,
      errors: [],
      quizQuestions: []
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
    return !HandyTools.objectsAreEqual(this.state.quiz, this.state.quizSaved);
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
      <div id="quiz-details" className="component details-component">
        <h1>Quiz Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'quiz', property: 'name' }) }
          </div>
          <a className={ "btn blue-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
            { Details.saveButtonText.call(this) }
          </a>
          <a className={ "btn delete-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
            Delete
          </a>
          <hr className="divider m-top" />
          <table className="admin-table no-links m-bottom">
            <thead>
              <tr>
                <th>Question</th>
                <th>Tag</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              { this.state.quizQuestions.map((quizQuestion, index) => {
                return(
                  <tr key={ index }>
                    <td>{ quizQuestion.questionName }</td>
                    <td>{ quizQuestion.tag }</td>
                    <td>{ quizQuestion.amount }</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding">Add New</a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return {
    quiz: reducers.standardReducer.entity,
    quizQuestions: reducers.standardReducer.array1,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetails);
