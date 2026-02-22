import React from "react";
import {
  Details,
  deepCopy,
  setUpNiceSelect,
  resetNiceSelect,
  createEntity,
  updateEntity,
  GrayedOut,
  Spinner,
  Button,
  ListBox,
  objectsAreEqual,
} from "handy-components";

export default class QuizQuestionNew extends React.Component {
  constructor(props) {
    super(props);

    const { entity, initialEntity, questions, tags } = this.props;

    this.state = {
      spinner: false,
      quizQuestion: deepCopy(entity || initialEntity),
      quizQuestionTagNames: entity ? deepCopy(entity.tagNames) : [],
      questions,
      tags,
      errors: {},
    };
  }

  componentDidMount() {
    setUpNiceSelect({
      selector: ".admin-modal select",
      func: Details.changeDropdownField.bind(this),
    });
    resetNiceSelect({
      selector: ".admin-modal select",
      func: Details.changeDropdownField.bind(this),
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
    const { entity, callback } = this.props;
    const { quizQuestion } = this.state;
    this.setState({ spinner: true });
    const action = entity
      ? updateEntity({
          directory: "quiz_questions",
          entityName: "quizQuestion",
          entity: quizQuestion,
          id: entity.id,
        })
      : createEntity({
          directory: "quiz_questions",
          entityName: "quizQuestion",
          entity: quizQuestion,
        });
    action.then(
      (response) => {
        callback(response.quizQuestions);
      },
      (response) => {
        this.setState({ spinner: false, errors: response.errors });
      },
    );
  }

  render() {
    const { entity } = this.props;
    const { spinner, quizQuestionTagNames } = this.state;
    return (
      <div className="new-entity handy-component admin-modal">
        <form className="white-box">
          <div className="row">
            {Details.renderField.bind(this)({
              columnWidth: 6,
              entity: "quizQuestion",
              property: "questionId",
              columnHeader: "Question",
              type: "modal",
              optionsArrayName: "questions",
              optionDisplayProperty: "name",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "quizQuestion",
              property: "tagId",
              columnHeader: "Tag",
              type: "modal",
              optionsArrayName: "tags",
              optionDisplayProperty: "name",
              noneOption: true,
            })}
            {Details.renderField.bind(this)({
              columnWidth: 2,
              entity: "quizQuestion",
              property: "amount",
            })}
          </div>
          <ListBox
            entityName="tag"
            entities={quizQuestionTagNames.map((name) => ({ name }))}
            displayProperty="name"
          />
          <Button
            submit
            disabled={spinner}
            text={entity ? "Update Question" : "Add Question"}
            onClick={() => this.clickSave()}
          />
          <GrayedOut visible={spinner} />
          <Spinner visible={spinner} />
        </form>
      </div>
    );
  }
}
