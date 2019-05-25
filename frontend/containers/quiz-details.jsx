import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index'
import NewEntity from './new-entity.jsx'

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

  updateQuizQuestions(quizQuestions) {
    this.setState({
      newQuizQuestionModalOpen: false,
      quizQuestions: quizQuestions
    });
  }

  deleteQuizQuestion(e) {
    this.setState({
      fetching: true
    });
    let id = e.target.dataset.id;
    this.props.deleteEntity('quiz_questions', id, (response) => {
      this.setState({
        fetching: false,
        quizQuestions: response.quizQuestions
      });
    });
  }

  totalQuestions() {
    let result = 0;
    this.state.quizQuestions.forEach((quizQuestion) => {
      result += quizQuestion.amount;
    })
    return result;
  }

  render() {
    return (
      <div id="quiz-details" className="component details-component">
        <h1>Quiz Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'quiz', property: 'name' }) }
            { Details.renderDropDown.bind(this)({ columnWidth: 3, entity: 'quiz', property: 'useArchived', columnHeader: 'Use Archived Questions?', boolean: true, maxOptions: 2 }) }
          </div>
          <a className={ "btn blue-button standard-width" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
            { Details.saveButtonText.call(this) }
          </a>
          <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
            Delete
          </a>
          <hr className="divider m-top" />
          <table className={ `admin-table no-links${this.totalQuestions() ? '' : ' m-bottom'}` }>
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
              { this.renderTotalRow() }
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding" onClick={ this.clickNewQuizQuestion.bind(this) }>Add New</a>
        </div>
        <Modal isOpen={ this.state.newQuizQuestionModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 900 }, 1) }>
          <NewEntity
            entityName="quizQuestion"
            entityNamePlural="quizQuestions"
            initialEntity={ { quizId: this.state.quiz.id, questionId: Common.firstElementPropertyOrBlank(this.state.questions, 'id'), tagId: '', amount: '1' } }
            callback={ this.updateQuizQuestions.bind(this) }
            buttonText="Add Question"
            staticData={{
              questions: this.state.questions,
              tags: this.state.tags
            }}
          />
        </Modal>
      </div>
    );
  }

  renderTotalRow() {
    let totalQuestions = this.totalQuestions();
    if (totalQuestions) {
      return(
        <tr className="no-hover">
          <td></td>
          <td></td>
          <td>{ totalQuestions }</td>
          <td></td>
        </tr>
      );
    }
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetails);
