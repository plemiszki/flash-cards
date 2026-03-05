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
    const { entity } = this.props;
    const { quizQuestion, quizQuestionTags } = this.state;
    this.setState({ addTagModalOpen: false });
    if (!entity) {
      const updated = [...quizQuestionTags, { id: tag.id, name: tag.name }];
      this.setState({ quizQuestionTags: updated });
      this.props.onTagsChange(updated.length);
      return;
    }
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
    const { entity } = this.props;
    const { quizQuestionTags } = this.state;
    if (!entity) {
      const updated = quizQuestionTags.filter((t) => t.id !== quizQuestionTag.id);
      this.setState({ quizQuestionTags: updated });
      this.props.onTagsChange(updated.length);
      return;
    }
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
    const { quizQuestion, quizQuestionTags } = this.state;
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
        if (entity || quizQuestionTags.length === 0) {
          callback(response.quizQuestions);
          return;
        }
        const newQQ = response.quizQuestions.find(
          (qq) => qq.position === quizQuestion.position,
        );
        let updatedQuizQuestions = response.quizQuestions;
        const createNextTag = (remaining) => {
          if (remaining.length === 0) {
            callback(updatedQuizQuestions);
            return;
          }
          const [tag, ...rest] = remaining;
          createEntity({
            directory: "quiz_question_tags",
            entityName: "quizQuestionTag",
            entity: { quizQuestionId: newQQ.id, tagId: tag.id },
          }).then((tagResponse) => {
            updatedQuizQuestions = updatedQuizQuestions.map((qq) =>
              qq.id === newQQ.id
                ? { ...qq, quizQuestionTags: tagResponse.quizQuestionTags }
                : qq,
            );
            createNextTag(rest);
          });
        };
        createNextTag(quizQuestionTags);
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
                { value: "all_highlighted", label: "Highlighted" },
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
