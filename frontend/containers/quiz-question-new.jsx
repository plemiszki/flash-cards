import React from "react";
import {
  Details,
  deepCopy,
  setUpNiceSelect,
  resetNiceSelect,
  createEntity,
  updateEntity,
  deleteEntity,
  GrayedOut,
  Spinner,
  Button,
  ListBox,
  ModalSelect,
  objectsAreEqual,
} from "handy-components";

export default class QuizQuestionNew extends React.Component {
  constructor(props) {
    super(props);

    const { entity, initialEntity, questions, tags } = this.props;

    this.state = {
      spinner: false,
      quizQuestion: deepCopy(entity || initialEntity),
      quizQuestionTags: entity ? deepCopy(entity.quizQuestionTags) : [],
      addTagModalOpen: false,
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

  addTag(tag) {
    const { quizQuestion } = this.state;
    this.setState({ addTagModalOpen: false });
    createEntity({
      directory: "quiz_question_tags",
      entityName: "quizQuestionTag",
      entity: { quizQuestionId: quizQuestion.id, tagId: tag.id },
    }).then((response) => {
      this.setState({ quizQuestionTags: response.quizQuestionTags });
      this.props.onTagsChange(response.quizQuestionTags.length);
    });
  }

  deleteTag(quizQuestionTag) {
    deleteEntity({
      directory: "quiz_question_tags",
      id: quizQuestionTag.id,
    }).then((response) => {
      this.setState({ quizQuestionTags: response.quizQuestionTags });
      this.props.onTagsChange(response.quizQuestionTags.length);
    });
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
    const { spinner, quizQuestion, quizQuestionTags, addTagModalOpen, tags } =
      this.state;
    const availableTags = tags.filter(
      (tag) => !quizQuestionTags.some((qqt) => qqt.name === tag.name),
    );
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
            {Details.renderDropDown.bind(this)({
              columnWidth: 4,
              entity: "quizQuestion",
              property: "quizQuestionType",
              columnHeader: "Type",
              options: [
                { value: "manual_amount", label: "Manual Amount" },
                { value: "all_highlighted", label: "All Highlighted" },
                { value: "all_non_archived", label: "All Non-Archived" },
                { value: "everything", label: "All" },
              ],
              optionDisplayProperty: "label",
            })}
            {quizQuestion.quizQuestionType === "manual_amount" &&
              Details.renderField.bind(this)({
                columnWidth: 2,
                entity: "quizQuestion",
                property: "amount",
              })}
          </div>
          <ListBox
            entityName="tag"
            entities={quizQuestionTags}
            displayProperty="name"
            clickAdd={() => this.setState({ addTagModalOpen: true })}
            clickDelete={(qqt) => this.deleteTag(qqt)}
            style={{ marginBottom: 30 }}
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
        <ModalSelect
          isOpen={addTagModalOpen}
          onClose={() => this.setState({ addTagModalOpen: false })}
          options={availableTags}
          property="name"
          func={(tag) => this.addTag(tag)}
          zIndex={1000}
        />
      </div>
    );
  }
}
