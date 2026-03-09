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
import QuizQuestionNew from "./quiz-question-new.jsx";

const QUIZ_QUESTION_TYPE_LABELS = {
  manual_amount: "Manual Amount",
  all_highlighted: "Highlighted",
  everything: "All",
};

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
      currentModalTagCount: 0,
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
        },
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
          },
        );
      },
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
      selectedQuizQuestionId,
      newQuizQuestionModalOpen,
      currentModalTagCount,
    } = this.state;

    const modalHeight =
      currentModalTagCount === 0 ? 340 : 335 + currentModalTagCount * 32;

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
                name: "tagNames",
                header: "Tags",
                displayFunction: (row) =>
                  row.chained
                    ? ""
                    : row.quizQuestionTags
                      ? row.quizQuestionTags.map((t) => t.name).join(", ")
                      : "",
              },
              {
                name: "quizQuestionType",
                header: "Type",
                displayFunction: (row) =>
                  row.chained
                    ? ""
                    : QUIZ_QUESTION_TYPE_LABELS[row.quizQuestionType] ||
                      row.quizQuestionType,
              },
              {
                name: "amount",
                sortDir: "desc",
                centered: true,
                totalRow: true,
                width: 150,
                displayFunction: (row) => row.amount,
                totalFunction: (row) => row.amount,
                arrowsIf: (row) =>
                  row.quizQuestionType === "manual_amount" && !row.chained,
                clickLeft: (row) => {
                  const { id, amount } = row;
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === id,
                  );
                  quizQuestion.amount = Math.max(amount - 1, 0);
                  this.updateQuizQuestion(quizQuestion);
                },
                clickRight: (row) => {
                  const { id, amount } = row;
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === id,
                  );
                  quizQuestion.amount = amount + 1;
                  this.updateQuizQuestion(quizQuestion);
                },
              },
              {
                name: "chain",
                include: quizQuestions.length > 1,
                header: "Chain",
                isSwitch: true,
                clickSwitch: (row, checked) => {
                  const quizQuestion = quizQuestions.find(
                    (quizQuestion) => quizQuestion.id === row.id,
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
                currentModalTagCount: row.quizQuestionTags?.length ?? 0,
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
                currentModalTagCount: 0,
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
          style={Common.newEntityModalStyles({
            width: 900,
            height: modalHeight,
          })}
        >
          {newQuizQuestionModalOpen && <QuizQuestionNew
            entity={
              selectedQuizQuestionId
                ? quizQuestions.find(
                    (quizQuestion) =>
                      quizQuestion.id === selectedQuizQuestionId,
                  )
                : null
            }
            initialEntity={{
              quizId: quiz.id,
              questionId: Common.firstElementPropertyOrBlank(questions, "id"),
              quizQuestionType: "manual_amount",
              amount: "1",
              position: quizQuestions.length,
            }}
            questions={questions}
            tags={tags}
            callback={this.updateQuizQuestions.bind(this)}
            onTagsChange={(count) =>
              this.setState({ currentModalTagCount: count })
            }
          />}
        </Modal>
      </div>
    );
  }
}
