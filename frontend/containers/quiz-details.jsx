import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import NewEntity from './new-entity.jsx';
import Common from './modules/common.js';
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
      quizQuestions: [],
      questions: [],
      tags: [],
      newQuizQuestionModalOpen: false
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

  clickNewQuizQuestion() {
    this.setState({
      newQuizQuestionModalOpen: true
    });
  }

  updateQuizQuestions(response) {
    this.setState({
      newQuizQuestionModalOpen: false,
      quizQuestions: response.entities || response
    });
  }

  deleteQuizQuestion(e) {
    let id = e.target.dataset.id;
    this.props.deleteEntity('quiz_questions', id, this.updateQuizQuestions.bind(this));
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              { HandyTools.alphabetizeArrayOfObjects(this.state.quizQuestions, 'questionName').map((quizQuestion, index) => {
                return(
                  <tr key={ index }>
                    <td>{ quizQuestion.questionName }</td>
                    <td>{ quizQuestion.tagName }</td>
                    <td>{ quizQuestion.amount }</td>
                    <td className="x-column" onClick={ this.deleteQuizQuestion.bind(this) } data-id={ quizQuestion.id }></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding" onClick={ this.clickNewQuizQuestion.bind(this) }>Add New</a>
        </div>
        <Modal isOpen={ this.state.newQuizQuestionModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 900 }, 1) }>
          <NewEntity
            entityName="quizQuestion"
            entityNamePlural="quizQuestions"
            initialEntity={ { quizId: this.state.quiz.id, questionId: Common.firstElementPropertyOrBlank(this.state.questions, 'id'), tagId: Common.firstElementPropertyOrBlank(this.state.tags, 'id'), amount: '1' } }
            callback={ this.updateQuizQuestions.bind(this) }
            buttonText="Add Question"
            array1={ this.state.questions }
            array2={ this.state.tags }
          />
        </Modal>
      </div>
    );
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return {
    quiz: reducers.standardReducer.entity,
    quizQuestions: reducers.standardReducer.array1,
    questions: reducers.standardReducer.array2,
    tags: reducers.standardReducer.array3,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetails);
