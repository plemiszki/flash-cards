import React from "react";
import Modal from "react-modal";
import {
  Common,
  Details,
  BottomButtons,
  fetchEntity,
  updateEntity,
  deepCopy,
  setUpNiceSelect,
  objectsAreEqual,
  Spinner,
  GrayedOut,
  OutlineButton,
  Table,
  deleteEntity,
  Button,
} from "handy-components";
import NewEntity from "./new-entity.jsx";

const USE_ALL_ENABLED = [
  "Spanish - Single Noun",
  "Spanish - Single Verb",
  "Spanish - Single Adjective",
  "Spanish - Misc Word",
  "French - Noun Singular",
  "French - Noun Plural",
  "French - Noun Gender",
  "French - Adjective Masculine Singular",
  "French - Adjective Masculine Plural",
  "French - Adjective Feminine Singular",
  "French - Adjective Feminine Plural",
  "French - Single Noun with Article, Singular or Plural",
  "French - Single Verb - Infinitive",
  "French - Single Adjective, Any Agreement",
  "French - Misc Word",
  "French - City",
  "French - Country",
  "French - Country Gender",
  "Card",
];

const AVAILABLE_ENABLED = USE_ALL_ENABLED;

export default class QuizDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyQuiz = {
      name: "",
    };

    this.state = {
      fetching: true,
      quiz: emptyQuiz,
      quizSaved: emptyQuiz,
      errors: [],
      quizQuestions: [],
      questions: [],
      tags: [],
      newQuizQuestionModalOpen: false,
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { quiz, questions, quizQuestions, tags } = response;
      this.setState(
        {
          fetching: false,
          quiz,
          quizSaved: deepCopy(quiz),
          quizQuestions,
          questions,
          tags,
          changesToSave: false,
        },
        () => {
          setUpNiceSelect({
            selector: "select",
            func: Details.changeField.bind(this, this.changeFieldArgs()),
          });
        }
      );
    });
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this),
    };
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.quiz, this.state.quizSaved);
  }

  clickSave() {
    const { quiz } = this.state;
    this.setState(
      {
        spinner: true,
        justSaved: true,
      },
      () => {
        updateEntity({
          entityName: "quiz",
          entity: quiz,
        }).then(
          (response) => {
            const { quiz } = response;
            this.setState({
              spinner: false,
              quiz,
              quizSaved: deepCopy(quiz),
              changesToSave: false,
            });
          },
          (response) => {
            const { errors } = response;
            this.setState({
              spinner: false,
              errors,
            });
          }
        );
      }
    );
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
      directory: "quiz_questions",
      id: quizQuestion.id,
      entityName: "quizQuestion",
      entity: quizQuestion,
    }).then((response) => {
      this.setState({
        spinner: false,
        quizQuestions: response.quizQuestions,
      });
    });
  }

  render() {
    const {
      spinner,
      quiz,
      questions,
      quizQuestions,
      tags,
      changesToSave,
      justSaved,
      entity,
      entityName,
      selectedQuizQuestionId,
      newQuizQuestionModalOpen,
    } = this.state;

    const includesCardsQuestion = quizQuestions.some(
      (quizQuestion) => quizQuestion.questionName === "Card"
    );
    const includesQuestionWithTag = quizQuestions.some(
      (quizQuestion) => quizQuestion.tagName
    );
    const includesAvailableQuestion = quizQuestions.some((quizQuestion) =>
      AVAILABLE_ENABLED.includes(quizQuestion.questionName)
    );
    const includesUseAllSwitchQuestion = quizQuestions.some((quizQuestion) =>
      USE_ALL_ENABLED.includes(quizQuestion.questionName)
    );

    return (
      <div className="handy-component">
        <h1>Quiz Details</h1>
        <div className="white-box">
          <div className="row">
            {Details.renderField.bind(this)({
              columnWidth: 6,
              entity: "quiz",
              property: "name",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 2,
              entity: "quiz",
              property: "maxQuestions",
            })}
          </div>
          <BottomButtons
            entityName="quiz"
            confirmDelete={Details.confirmDelete.bind(this)}
            justSaved={justSaved}
            changesToSave={changesToSave}
            disabled={spinner}
            clickSave={() => {
              this.clickSave();
            }}
            marginBottom
          >
            <Button
              text="Run Quiz"
              onClick={() => {
                window.location.pathname = `/quizzes/${quiz.id}/run`;
              }}
              float
              marginRight
            />
          </BottomButtons>
          <hr />
          <Table
            columns={[
              {
                name: "questionName",
                header: "Question",
              },
              {
                name: "tagName",
                header: "Tag",
                include: includesQuestionWithTag,
              },
              {
                name: "useAllAvailable",
                include: includesUseAllSwitchQuestion,
                header: "Use All",
                isSwitch: true,
                switchChecked: (row) => row.useAllAvailable,
                switchDisabled: (row) => false,
                clickSwitch: (row, checked) => {
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === row.id
                  );
                  quizQuestion.useAllAvailable = checked;
                  this.updateQuizQuestion(quizQuestion);
                },
                displayIf: (row) =>
                  USE_ALL_ENABLED.includes(row.questionName) && !row.chained,
                centered: true,
              },
              {
                name: "amount",
                sortDir: "desc",
                centered: true,
                totalRow: true,
                width: 150,
                displayFunction: (row) =>
                  row.chained
                    ? row.chainedAmount
                    : row.useAllAvailable
                    ? row.questionName === "Card"
                      ? row.unarchived
                      : row.available
                    : row.amount,
                totalFunction: (row) =>
                  row.chained
                    ? row.chainedAmount
                    : row.useAllAvailable
                    ? row.questionName === "Card"
                      ? row.unarchived
                      : row.available
                    : row.amount,
                arrowsIf: (row) => !row.useAllAvailable && !row.chained,
                clickLeft: (row) => {
                  const { id, amount } = row;
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === id
                  );
                  quizQuestion.amount = Math.max(amount - 1, 0);
                  this.updateQuizQuestion(quizQuestion);
                },
                clickRight: (row) => {
                  const { id, amount } = row;
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === id
                  );
                  quizQuestion.amount = amount + 1;
                  this.updateQuizQuestion(quizQuestion);
                },
              },
              {
                name: "available",
                include: includesAvailableQuestion,
                sortDir: "desc",
                width: 100,
                centered: true,
                totalRow: true,
                displayIf: (row) =>
                  AVAILABLE_ENABLED.includes(row.questionName),
              },
              {
                name: "unarchived",
                include: includesCardsQuestion,
                header: "Active",
                sortDir: "desc",
                width: 100,
                centered: true,
                displayIf: (row) => row.questionName === "Card",
              },
              {
                name: "archived",
                include: includesCardsQuestion,
                sortDir: "desc",
                width: 100,
                centered: true,
                displayIf: (row) => row.questionName === "Card",
              },
              {
                name: "chain",
                include: quizQuestions.length > 1,
                header: "Chain",
                isSwitch: true,
                clickSwitch: (row, checked) => {
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === row.id
                  );
                  quizQuestion.chained = checked;
                  this.updateQuizQuestion(quizQuestion);
                },
                switchChecked: (row) => row.chained,
                displayIf: (row) => row.position > 0 && !row.useAllAvailable,
                centered: true,
              },
              {
                isEditButton: true,
              },
            ]}
            rows={quizQuestions}
            links={false}
            sortable={false}
            styleIf={[
              {
                func: (row) => row.unarchived > 0,
                style: {
                  color: "green",
                  fontFamily: "TeachableSans-SemiBold",
                },
              },
            ]}
            clickDelete={(row) => {
              this.setState({ spinner: true });
              deleteEntity({
                id: row.id,
                directory: "quiz_questions",
              }).then((response) => {
                const { quizQuestions } = response;
                this.setState({
                  spinner: false,
                  quizQuestions,
                });
              });
            }}
            clickEdit={(row) => {
              this.setState({
                selectedQuizQuestionId: row.id,
                newQuizQuestionModalOpen: true,
              });
            }}
            marginBottom
          />
          <OutlineButton
            color="#5F5F5F"
            text="Add New"
            onClick={() => {
              this.setState({
                selectedQuizQuestionId: null,
                newQuizQuestionModalOpen: true,
              });
            }}
          />
          <Spinner visible={spinner} />
          <GrayedOut visible={spinner} />
        </div>
        <Modal
          isOpen={newQuizQuestionModalOpen}
          onRequestClose={Common.closeModals.bind(this)}
          contentLabel="Modal"
          style={Common.newEntityModalStyles({ width: 900 }, 1)}
        >
          <NewEntity
            entityName="quizQuestion"
            entityNamePlural="quizQuestions"
            entity={
              selectedQuizQuestionId
                ? quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === selectedQuizQuestionId
                  )
                : null
            }
            initialEntity={{
              quizId: quiz.id,
              questionId: Common.firstElementPropertyOrBlank(questions, "id"),
              tagId: "",
              amount: "1",
              position: quizQuestions.length,
            }}
            callback={this.updateQuizQuestions.bind(this)}
            buttonText={`${selectedQuizQuestionId ? "Update" : "Add"} Question`}
            passData={{
              questions,
              tags,
            }}
          />
        </Modal>
      </div>
    );
  }
}
