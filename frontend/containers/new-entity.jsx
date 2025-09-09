import React from "react";
import { snakeCase } from "change-case";
import { titleCase } from "title-case";
import {
  Details,
  deepCopy,
  setUpNiceSelect,
  resetNiceSelect,
  createEntity,
  updateEntity,
  sendRequest,
  GrayedOut,
  Spinner,
  Button,
} from "handy-components";

let entityNamePlural;
let directory;

export default class NewEntity extends React.Component {
  constructor(props) {
    super(props);

    const { entityName, fetchData, entity, initialEntity, passData } =
      this.props;

    entityNamePlural = this.props.entityNamePlural || `${entityName}s`;
    directory = snakeCase(entityNamePlural);
    let state_obj = {
      spinner: !!fetchData,
      [entityName]: deepCopy(entity || initialEntity),
      errors: {},
    };

    if (entityName === "card") {
      state_obj.tag = {
        tagId: null,
      };
    }

    if (passData) {
      Object.keys(passData).forEach((arrayName) => {
        state_obj[arrayName] = passData[arrayName];
      });
    }

    if (fetchData) {
      fetchData.forEach((arrayName) => {
        state_obj[arrayName] = [];
      });
    }

    this.state = state_obj;
  }

  componentDidMount() {
    const { entityName, fetchData } = this.props;

    setUpNiceSelect({
      selector: ".admin-modal select",
      func: Details.changeDropdownField.bind(this),
    });
    if (fetchData) {
      sendRequest(`/api/${directory}/new`).then((response) => {
        let entity = deepCopy(this.state[entityName]);
        let obj = { spinner: false };
        fetchData.forEach((arrayName) => {
          obj[arrayName] = response[arrayName];
        });
        obj[entityName] = entity;

        if (entityName === "card") {
          const storedTagId = localStorage.getItem("tag-id");
          if (storedTagId && storedTagId !== "undefined") {
            obj.tag = { tagId: storedTagId };
          }
        }

        this.setState(obj, () => {
          resetNiceSelect({
            selector: ".admin-modal select",
            func: Details.changeDropdownField.bind(this),
          });
        });
      });
    } else {
      resetNiceSelect({
        selector: ".admin-modal select",
        func: Details.changeDropdownField.bind(this),
      });
    }
  }

  clickAdd() {
    const {
      entityNamePlural: entityNamePluralProps,
      responseKey,
      entityName,
      redirectAfterCreate,
      callback,
      callbackFullProps,
    } = this.props;
    const entityNamePlural = entityNamePluralProps || `${entityName}s`;
    const directory = snakeCase(entityNamePlural);
    this.setState({
      spinner: true,
    });
    createEntity({
      directory,
      entityName,
      entity: this.state[entityName],
      additionalData:
        entityName === "card"
          ? {
              tagId: this.state.tag.tagId,
            }
          : null,
    }).then(
      (response) => {
        if (redirectAfterCreate) {
          window.location.href = `/${directory}/${response[entityName].id}`;
        } else {
          if (callback) {
            callback(
              response[responseKey || entityNamePlural],
              entityNamePlural
            );
          }
          if (callbackFullProps) {
            callbackFullProps(response, entityNamePlural);
          }
        }
      },
      (response) => {
        this.setState(
          {
            spinner: false,
            errors: response.errors,
          },
          () => {
            resetNiceSelect({
              selector: ".admin-modal select",
              func: Details.changeField.bind(this, this.changeFieldArgs()),
            });
          }
        );
      }
    );
  }

  clickUpdate(id) {
    const {
      entityNamePlural: entityNamePluralProps,
      responseKey,
      entityName,
      redirectAfterCreate,
      callback,
      callbackFullProps,
    } = this.props;
    const { tag } = this.state;
    const entityNamePlural = entityNamePluralProps || `${entityName}s`;
    const directory = snakeCase(entityNamePlural);
    this.setState({
      spinner: true,
    });
    updateEntity({
      directory,
      entityName,
      entity: this.state[entityName],
      id,
      additionalData:
        entityName === "card"
          ? {
              tagId: tag.tagId,
            }
          : null,
    }).then(
      (response) => {
        if (redirectAfterCreate) {
          window.location.href = `/${directory}/${response[entityName].id}`;
        } else {
          if (callback) {
            callback(
              response[responseKey || entityNamePlural],
              entityNamePlural
            );
          }
          if (callbackFullProps) {
            callbackFullProps(response, entityNamePlural);
          }
        }
      },
      (response) => {
        this.setState(
          {
            spinner: false,
            errors: response.errors,
          },
          () => {
            resetNiceSelect({
              selector: ".admin-modal select",
              func: Details.changeField.bind(this, this.changeFieldArgs()),
            });
          }
        );
      }
    );
  }

  changeFieldArgs() {
    return {
      callback: () => {
        if (this.props.entityName === "card") {
          localStorage.setItem("tag-id", this.state.tag.tagId);
        }
      },
    };
  }

  render() {
    const { buttonText, entityName, entity } = this.props;
    const { spinner } = this.state;
    return (
      <div className="new-entity handy-component admin-modal">
        <form className="white-box">
          {this.renderFields()}
          <Button
            submit
            disabled={spinner}
            text={
              buttonText ||
              `${entity ? "Update" : "Add"} ${titleCase(entityName)}`
            }
            onClick={() => {
              entity ? this.clickUpdate(entity.id) : this.clickAdd();
            }}
          />
          <GrayedOut visible={spinner} />
          <Spinner visible={spinner} />
        </form>
      </div>
    );
  }

  renderFields() {
    switch (this.props.entityName) {
      case "noun":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "noun",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "noun",
              property: "englishPlural",
            })}
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select
                onChange={Details.changeField.bind(
                  this,
                  this.changeFieldArgs()
                )}
                value={this.state.noun.gender}
                data-entity="noun"
                data-field="gender"
              >
                <option value={"1"}>Male</option>
                <option value={"2"}>Female</option>
              </select>
              {Details.renderDropdownFieldError([], [])}
            </div>
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "noun",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "noun",
              property: "foreign",
              columnHeader: "Hindi",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "noun",
              property: "foreignPlural",
              columnHeader: "Hindi Plural",
            })}
          </div>,
          <div key="3" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "noun",
              property: "transliterated",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "noun",
              property: "transliteratedPlural",
            })}
          </div>,
        ];
      case "verb":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "verb",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 3,
              entity: "verb",
              property: "infinitive",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 3,
              entity: "verb",
              property: "transliteratedInfinitive",
            })}
            {Details.renderCheckbox.bind(this)({
              columnWidth: 2,
              entity: "verb",
              property: "needsAttention",
              columnHeader: "N.A. Tag",
            })}
          </div>,
        ];
      case "adjective":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "english",
            })}
            {Details.renderCheckbox.bind(this)({
              columnWidth: 2,
              entity: "adjective",
              property: "needsAttention",
              columnHeader: "N.A. Tag",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "masculine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "feminine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "masculinePlural",
            })}
          </div>,
          <div key="3" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "transliteratedMasculine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "transliteratedFeminine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adjective",
              property: "transliteratedMasculinePlural",
            })}
          </div>,
        ];
      case "adverb":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adverb",
              property: "foreign",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adverb",
              property: "transliterated",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "adverb",
              property: "english",
            })}
          </div>,
        ];
      case "card":
        const answerCharacters = this.state.card.answer.split("");
        const answerIsRegEx =
          answerCharacters[0] === "/" &&
          answerCharacters[answerCharacters.length - 1] === "/";
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "card",
              property: "question",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              type: "textbox",
              rows: 5,
              columnWidth: 12,
              entity: "card",
              property: "answer",
              styles: answerIsRegEx
                ? {
                    fontSize: 16,
                    fontFamily: "Inconsolata",
                  }
                : {},
            })}
          </div>,
          <div key="3" className="row">
            {Details.renderField.bind(this)({
              type: "modal",
              columnWidth: 4,
              entity: "tag",
              property: "tagId",
              columnHeader: "Tag",
              optionDisplayProperty: "name",
              noneOption: true,
            })}
          </div>,
        ];
      case "tag":
      case "quiz":
      case "question":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: this.props.entityName,
              property: "name",
            })}
          </div>,
        ];
      case "quizQuestion":
        return (
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
        );
      case "cardTag":
        return (
          <div className="row">
            {Details.renderDropDown.bind(this)({
              columnWidth: 12,
              entity: "cardTag",
              property: "tagId",
              columnHeader: "Tag",
              options: this.props.array1,
              optionDisplayProperty: "name",
              maxOptions: 2,
            })}
          </div>
        );
      case "spanishNoun":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishNoun",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishNoun",
              property: "englishPlural",
            })}
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select
                onChange={Details.changeField.bind(
                  this,
                  this.changeFieldArgs()
                )}
                value={this.state.spanishNoun.gender}
                data-entity="spanishNoun"
                data-field="gender"
              >
                <option value={"1"}>Male</option>
                <option value={"2"}>Female</option>
              </select>
              {Details.renderDropdownFieldError([], [])}
            </div>
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "spanishNoun",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishNoun",
              property: "spanish",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishNoun",
              property: "spanishPlural",
            })}
          </div>,
        ];
      case "frenchNoun":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchNoun",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchNoun",
              property: "englishPlural",
            })}
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select
                onChange={Details.changeField.bind(
                  this,
                  this.changeFieldArgs()
                )}
                value={this.state.frenchNoun.gender}
                data-entity="frenchNoun"
                data-field="gender"
              >
                <option value={"1"}>Male</option>
                <option value={"2"}>Female</option>
              </select>
              {Details.renderDropdownFieldError([], [])}
            </div>
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchNoun",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchNoun",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchNoun",
              property: "frenchPlural",
            })}
          </div>,
          <div key="3" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "frenchNoun",
              property: "url",
              columnHeader: "Link",
            })}
          </div>,
        ];
      case "spanishVerb":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishVerb",
              property: "spanish",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishVerb",
              property: "english",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "spanishVerb",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
        ];
      case "frenchVerb":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchVerb",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchVerb",
              property: "english",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchVerb",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
        ];
      case "spanishAdjective":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishAdjective",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishAdjective",
              property: "masculine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishAdjective",
              property: "masculinePlural",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "spanishAdjective",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishAdjective",
              property: "feminine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "spanishAdjective",
              property: "femininePlural",
            })}
          </div>,
        ];
      case "frenchAdjective":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "masculine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "masculinePlural",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchAdjective",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "feminine",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "femininePlural",
            })}
          </div>,
          <div key="3" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 8,
              entity: "frenchAdjective",
              property: "url",
              columnHeader: "Link",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchAdjective",
              property: "note",
            })}
          </div>,
        ];
      case "spanishMisc":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishMisc",
              property: "spanish",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "spanishMisc",
              property: "english",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "spanishMisc",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
        ];
      case "frenchMisc":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchMisc",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchMisc",
              property: "english",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchMisc",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
          <div key="2" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "frenchMisc",
              property: "url",
              columnHeader: "Link",
            })}
          </div>,
        ];
      case "frenchCountry":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchCountry",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchCountry",
              property: "english",
            })}
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select
                onChange={Details.changeField.bind(
                  this,
                  this.changeFieldArgs()
                )}
                value={this.state.frenchCountry.gender}
                data-entity="frenchCountry"
                data-field="gender"
              >
                <option value={"1"}>Male</option>
                <option value={"2"}>Female</option>
              </select>
              {Details.renderDropdownFieldError([], [])}
            </div>
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchCountry",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
        ];
      case "frenchCity":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchCity",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 5,
              entity: "frenchCity",
              property: "english",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchCity",
              property: "needsAttention",
              columnHeader: "Needs Attention",
            })}
          </div>,
        ];
      case "matchBin":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "matchBin",
              property: "name",
            })}
          </div>,
        ];
      case "matchItem":
        return [
          <div key="1" className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "matchItem",
              property: "name",
            })}
          </div>,
        ];
    }
  }
}
