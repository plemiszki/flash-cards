import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index'
import NewEntity from './new-entity.jsx'
import { sortBy } from 'lodash'

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
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: 'quizzes'
    }).then(() => {
      let columnsVisible = this.determineColumnVisibility(this.props.quizQuestions);
      this.setState({
        fetching: false,
        quiz: this.props.quiz,
        quizSaved: HandyTools.deepCopy(this.props.quiz),
        quizQuestions: this.props.quizQuestions,
        questions: this.props.questions,
        tags: this.props.tags,
        changesToSave: false,
        renderAvailableColumn: columnsVisible[0],
        renderArchivedColumns: columnsVisible[1]
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
    return !HandyTools.objectsAreEqual(this.state.quiz, this.state.quizSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, () => {
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
    let id = e.target.parentElement.dataset.id;
    this.props.deleteEntity({
      directory: 'quiz_questions',
      id,
      callback: (response) => {
        let columnsVisible = this.determineColumnVisibility(response.quizQuestions);
        this.setState({
          fetching: false,
          quizQuestions: response.quizQuestions,
          renderAvailableColumn: columnsVisible[0],
          renderArchivedColumns: columnsVisible[1]
        });
      }
    });
  }

  totalQuestions() {
    let result = 0;
    this.state.quizQuestions.forEach((quizQuestion) => {
      if (quizQuestion.useAllAvailable) {
        result += quizQuestion.available;
      } else {
        result += quizQuestion.amount;
      }
    })
    return result;
  }

  clickCheckbox(e) {
    let id = e.target.parentElement.parentElement.dataset.id;
    let quizQuestion = HandyTools.deepCopy(HandyTools.findObjectInArrayById(this.state.quizQuestions, id));
    this.setState({
      fetching: true
    });
    this.props.updateEntity({
      id,
      directory: 'quiz_questions',
      entityName: 'quizQuestion',
      entity: { useAllAvailable: e.target.checked }
    }).then(() => {
      this.setState({
        fetching: false,
        quizQuestions: this.props.quizQuestions
      });
    })
  }

  updateQuizQuestion(dir, e) {
    let id = e.target.parentElement.dataset.id;
    let quizQuestion = HandyTools.deepCopy(HandyTools.findObjectInArrayById(this.state.quizQuestions, id));
    let newAmount;
    if (dir == 'left' && quizQuestion.amount > 1) {
      newAmount = quizQuestion.amount -= 1;
    } else if (dir == 'right') {
      newAmount = quizQuestion.amount += 1;
    } else {
      return;
    }
    this.setState({
      fetching: true
    });
    this.props.updateEntity({
      id,
      directory: 'quiz_questions',
      entityName: 'quizQuestion',
      entity: { amount: newAmount }
    }).then(() => {
      let columnsVisible = this.determineColumnVisibility(this.props.quizQuestions);
      this.setState({
        fetching: false,
        quizQuestions: this.props.quizQuestions,
        renderAvailableColumn: columnsVisible[0],
        renderArchivedColumns: columnsVisible[1]
      });
    })
  }

  determineColumnVisibility(quizQuestions) {
    let quizQuestionsWithAvailabilityData = 0;
    let quizQuestionsWithArchivedData = 0;
    quizQuestions.forEach((quizQuestion) => {
      if (typeof quizQuestion.available === 'number') {
        quizQuestionsWithAvailabilityData += 1;
      } else {
        quizQuestionsWithArchivedData += 1;
      }
    })
    return [quizQuestionsWithAvailabilityData > 0, quizQuestionsWithArchivedData > 0];
  }

  render() {
    return(
      <div id="quiz-details" className="component details-component">
        <h1>Quiz Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'quiz', property: 'name' }) }
            { Details.renderField.bind(this)({ columnWidth: 2, entity: 'quiz', property: 'maxQuestions' }) }
          </div>
          <a className={ "btn blue-button standard-width" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
            { Details.saveButtonText.call(this) }
          </a>
          <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
            Delete
          </a>
          <hr className="divider m-top" />
          <table className={ `admin-table no-cursor no-links${this.totalQuestions() ? '' : ' m-bottom'}` }>
            <thead>
              <tr>
                <th>Question</th>
                <th>Tag</th>
                { this.renderUseAllHeader() }
                <th></th>
                <th className="amount">Amount</th>
                <th></th>
                { this.renderAvailableHeader() }
                { this.renderArchivedHeaders() }
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
              </tr>
              { sortBy(this.state.quizQuestions, ['questionName', 'tagName']).map((quizQuestion, index) => {
                let rowClasses = '';
                if (quizQuestion.available) {
                  rowClasses = 'wide-arrows';
                  if ((quizQuestion.available.unarchived + quizQuestion.available.archived) < quizQuestion.amount) {
                    rowClasses = 'wide-arrows red';
                  } else if (quizQuestion.available.unarchived > 0) {
                    rowClasses = 'wide-arrows green';
                  }
                }
                return(
                  <tr className={ rowClasses } key={ index } data-id={ quizQuestion.id }>
                    <td>{ quizQuestion.questionName }</td>
                    <td>{ quizQuestion.tagName }</td>
                    { this.renderUseAllColumn(quizQuestion) }
                    <td className={ 'left-arrow' + (quizQuestion.useAllAvailable ? ' hide-arrow' : '') } onClick={ quizQuestion.useAllAvailable ? null : this.updateQuizQuestion.bind(this, 'left') }></td>
                    <td className="amount">{ quizQuestion.useAllAvailable ? quizQuestion.available : quizQuestion.amount }</td>
                    <td className={ 'right-arrow' + (quizQuestion.useAllAvailable ? ' hide-arrow' : '') } onClick={ quizQuestion.useAllAvailable ? null : this.updateQuizQuestion.bind(this, 'right') }></td>
                    { this.renderAvailableColumn(quizQuestion) }
                    { this.renderArchivedColumns(quizQuestion) }
                    <td className="x-column" onClick={ this.deleteQuizQuestion.bind(this) }></td>
                  </tr>
                );
              }) }
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

  renderUseAllHeader() {
    if (this.state.renderAvailableColumn) {
      return(
        <th>Use All</th>
      );
    }
  }

  renderAvailableHeader() {
    if (this.state.renderAvailableColumn) {
      return(
        <th className="available">Available</th>
      );
    }
  }

  renderArchivedHeaders() {
    if (this.state.renderArchivedColumns) {
      return([
        <th key="1" className="unarchived"><div className="unarchived-header"></div></th>,
        <th key="2" className="archived"><div className="archived-header"></div></th>
      ]);
    }
  }

  renderUseAllColumn(quizQuestion) {
    if (this.state.renderAvailableColumn) {
      return(
        <td><input type="checkbox" checked={ quizQuestion.useAllAvailable } onChange={ this.clickCheckbox.bind(this) } /></td>
      );
    }
  }

  renderAvailableColumn(quizQuestion) {
    if (this.state.renderAvailableColumn) {
      return(
        <td className="available">{ typeof quizQuestion.available == 'number' ? quizQuestion.available : '' }</td>
      );
    }
  }

  renderArchivedColumns(quizQuestion) {
    if (this.state.renderArchivedColumns) {
      return([
        <td key="1">{ quizQuestion.available ? quizQuestion.available.unarchived : '' }</td>,
        <td key="2">{ quizQuestion.available ? quizQuestion.available.archived : '' }</td>
      ]);
    }
  }

  renderTotalRow() {
    return(
      <tr className="no-hover">
        <td></td>
        <td></td>
        <td></td>
        <td className="amount">{ this.totalQuestions() }</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetails);
