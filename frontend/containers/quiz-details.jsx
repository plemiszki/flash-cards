import React from 'react'
import Modal from 'react-modal'
import { Common, Details, BottomButtons, fetchEntity, updateEntity, deepCopy, setUpNiceSelect, objectsAreEqual, Spinner, GrayedOut, OutlineButton, Table, deleteEntity } from 'handy-components'
import NewEntity from './new-entity.jsx'

export default class QuizDetails extends React.Component {
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
    fetchEntity().then((response) => {
      const { quiz, questions, quizQuestions, tags } = response;
      let columnsVisible = this.determineColumnVisibility(quizQuestions);
      this.setState({
        fetching: false,
        quiz,
        quizSaved: deepCopy(quiz),
        quizQuestions,
        questions,
        tags,
        changesToSave: false,
        renderAvailableColumn: columnsVisible[0],
        renderArchivedColumns: columnsVisible[1]
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.quiz, this.state.quizSaved);
  }

  clickSave() {
    const { quiz } = this.state;
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'quiz',
        entity: quiz,
      }).then((response) => {
        const { quiz } = response;
        this.setState({
          spinner: false,
          quiz,
          quizSaved: deepCopy(quiz),
          changesToSave: false,
        });
      }, (response) => {
        const { errors } = response;
        this.setState({
          spinner: false,
          errors,
        });
      });
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
    const { spinner, quiz, questions, quizQuestions, tags, changesToSave, justSaved } = this.state;
    return (
      <div className="handy-component">
        <h1>Quiz Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'quiz', property: 'name' }) }
            { Details.renderField.bind(this)({ columnWidth: 2, entity: 'quiz', property: 'maxQuestions' }) }
          </div>
          <BottomButtons
            entityName="quiz"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <Table
            columns={
              [
                {
                  name: 'questionName', header: 'Question',
                },
                {
                  name: 'tagName', header: 'Tag',
                },
                {
                  name: 'amount',
                },
              ]
            }
            rows={ quizQuestions }
            links={ false }
            sortable={ false }
            clickDelete={ row => {
              this.setState({ spinner: true });
              deleteEntity({
                id: row.id,
                directory: 'quiz_questions',
              }).then((response) => {
                const { quizQuestions } = response;
                this.setState({
                  spinner: false,
                  quizQuestions,
                });
              });
            } }
            marginBottom
          />
          <OutlineButton
            color="#5F5F5F"
            text="Add New"
            onClick={ () => this.setState({ newQuizQuestionModalOpen: true }) }
          />
        </div>
        <Modal isOpen={ this.state.newQuizQuestionModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 900 }, 1) }>
          <NewEntity
            entityName="quizQuestion"
            entityNamePlural="quizQuestions"
            initialEntity={ { quizId: quiz.id, questionId: Common.firstElementPropertyOrBlank(questions, 'id'), tagId: '', amount: '1' } }
            callback={ this.updateQuizQuestions.bind(this) }
            buttonText="Add Question"
            passData={{
              questions,
              tags,
            }}
          />
        </Modal>
        <Spinner visible={ spinner } />
        <GrayedOut visible={ spinner } />
      </div>
    );
  }

  renderUseAllHeader() {
    if (this.state.renderAvailableColumn) {
      return (
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
        { this.state.renderAvailableColumn ? (<td></td>) : null }
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


{/* <hr />
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
      return (
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
  </table> */}
