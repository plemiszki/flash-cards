import React from 'react'
import Modal from 'react-modal'
import { Common, Details, BottomButtons, fetchEntity, updateEntity, deepCopy, setUpNiceSelect, objectsAreEqual, Spinner, GrayedOut, OutlineButton, Table, deleteEntity, Button } from 'handy-components'
import NewEntity from './new-entity.jsx'

const USE_ALL_ENABLED = [
  'Spanish - Single Noun',
  'Spanish - Single Verb',
  'Spanish - Single Adjective',
  'Spanish - Misc Word',
];

const AVAILABLE_ENABLED = USE_ALL_ENABLED.concat([
  'Card',
]);

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
      this.setState({
        fetching: false,
        quiz,
        quizSaved: deepCopy(quiz),
        quizQuestions,
        questions,
        tags,
        changesToSave: false,
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this),
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

  updateQuizQuestions(quizQuestions) {
    this.setState({
      newQuizQuestionModalOpen: false,
      quizQuestions: quizQuestions,
    });
  }

  updateQuizQuestion(quizQuestion) {
    this.setState({ spinner: true });
    updateEntity({
      directory: 'quiz_questions',
      id: quizQuestion.id,
      entityName: 'quizQuestion',
      entity: quizQuestion,
    }).then(response => {
      this.setState({
        spinner: false,
        quizQuestions: response.quizQuestions,
      });
    });
  }

  render() {
    const { spinner, quiz, questions, quizQuestions, tags, changesToSave, justSaved } = this.state;

    const includesCardsQuestion = quizQuestions.some(quizQuestion => quizQuestion.questionName === 'Card');
    const includesQuestionWithTag = quizQuestions.some(quizQuestion => quizQuestion.tagName);
    const includesAvailableQuestion = quizQuestions.some(quizQuestion => AVAILABLE_ENABLED.includes(quizQuestion.questionName))
    const includesUseAllSwitchQuestion = quizQuestions.some(quizQuestion => USE_ALL_ENABLED.includes(quizQuestion.questionName))

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
          >
            <Button
              text="Run Quiz"
              onClick={ () => { window.location.pathname = `/quizzes/${quiz.id}/run` } }
              float
              marginRight
            />
          </BottomButtons>
          <hr />
          <Table
            columns={
              [
                {
                  name: 'questionName', header: 'Question',
                },
                {
                  name: 'tagName', header: 'Tag', include: includesQuestionWithTag,
                },
                {
                  name: 'useAllAvailable',
                  include: includesUseAllSwitchQuestion,
                  header: 'Use All',
                  sortable: false,
                  isSwitch: true,
                  clickSwitch: (row, checked) => {
                    const quizQuestion = quizQuestions.find(quizQuestion => quizQuestion.id === row.id)
                    quizQuestion.useAllAvailable = checked;
                    this.updateQuizQuestion(quizQuestion);
                  },
                  displayIf: row => USE_ALL_ENABLED.includes(row.questionName),
                },
                {
                  name: 'amount',
                  sortDir: 'desc',
                  centered: true,
                  totalRow: true,
                  sortable: false,
                  width: 150,
                  displayFunction: row => row.useAllAvailable ? row.available : row.amount,
                  arrowsIf: row => !row.useAllAvailable,
                  clickLeft: (row) => {
                    const { id, amount } = row;
                    const quizQuestion = quizQuestions.find(quizQuestion => quizQuestion.id === id)
                    quizQuestion.amount = Math.max(amount - 1, 1);
                    this.updateQuizQuestion(quizQuestion);
                  },
                  clickRight: (row) => {
                    const { id, amount } = row;
                    const quizQuestion = quizQuestions.find(quizQuestion => quizQuestion.id === id)
                    quizQuestion.amount = amount + 1;
                    this.updateQuizQuestion(quizQuestion);
                  },
                },
                {
                  name: 'available',
                  include: includesAvailableQuestion,
                  sortDir: 'desc',
                  sortable: false,
                  width: 100,
                  centered: true,
                  totalRow: true,
                  displayIf: row => AVAILABLE_ENABLED.includes(row.questionName),
                },
                {
                  name: 'unarchived',
                  include: includesCardsQuestion,
                  header: 'Active',
                  sortDir: 'desc',
                  sortable: false,
                  width: 100,
                  centered: true,
                  displayIf: row => row.questionName === 'Card',
                },
                {
                  name: 'archived',
                  include: includesCardsQuestion,
                  sortDir: 'desc',
                  sortable: false,
                  width: 100,
                  centered: true,
                  displayIf: row => row.questionName === 'Card',
                },
              ]
            }
            rows={ quizQuestions }
            links={ false }
            sortable={ includesQuestionWithTag }
            styleIf={[
              {
                func: row => row.unarchived > 0,
                style: {
                  color: 'green',
                  fontFamily: 'TeachableSans-SemiBold',
                }
              }
            ]}
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
}
