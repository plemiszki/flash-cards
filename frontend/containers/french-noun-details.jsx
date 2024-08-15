import React from "react";
import {
  deepCopy,
  objectsAreEqual,
  Details,
  setUpNiceSelect,
  fetchEntity,
  updateEntity,
  BottomButtons,
  Spinner,
  GrayedOut,
} from "handy-components";
import TagsSection from "./tags-section";
import StreakInfo from "./streak-info";

export default class FrenchNounDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchNoun = {
      english: "",
      englishSaved: "",
      french: "",
      frenchSaved: "",
      note: "",
    };

    this.state = {
      spinner: true,
      frenchNoun: emptyFrenchNoun,
      frenchNounSaved: emptyFrenchNoun,
      errors: [],
      frenchNounTags: [],
      tags: [],
      newCardTagModalOpen: false,
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchNoun, frenchNounTags, tags } = response;
      this.setState(
        {
          spinner: false,
          frenchNoun,
          frenchNounSaved: deepCopy(frenchNoun),
          tags,
          frenchNounTags,
          changesToSave: false,
        },
        () => {
          setUpNiceSelect({
            selector: "select",
            func: Details.changeDropdownField.bind(this),
          });
        }
      );
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this),
    };
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.frenchNoun, this.state.frenchNounSaved);
  }

  clickSave() {
    this.setState(
      {
        spinner: true,
        justSaved: true,
      },
      () => {
        updateEntity({
          entityName: "frenchNoun",
          entity: this.state.frenchNoun,
        }).then(
          (response) => {
            const { frenchNoun } = response;
            this.setState({
              spinner: false,
              frenchNoun,
              frenchNounSaved: deepCopy(frenchNoun),
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

  render() {
    const {
      spinner,
      justSaved,
      changesToSave,
      frenchNounTags,
      tags,
      frenchNoun,
      frenchNounSaved,
    } = this.state;
    return (
      <>
        <div className="handy-component">
          <h1>French Noun Details</h1>
          <div className="white-box">
            <div className="row">
              {Details.renderField.bind(this)({
                columnWidth: 4,
                entity: "frenchNoun",
                property: "english",
              })}
              {frenchNoun.uncountable
                ? null
                : Details.renderField.bind(this)({
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
                  value={frenchNoun.gender}
                  data-entity="frenchNoun"
                  data-field="gender"
                >
                  <option value={"1"}>Male</option>
                  <option value={"2"}>Female</option>
                </select>
                {Details.renderFieldError([], [])}
              </div>
              {Details.renderSwitch.bind(this)({
                columnWidth: 2,
                entity: "frenchNoun",
                property: "uncountable",
              })}
            </div>
            <div className="row">
              {Details.renderField.bind(this)({
                columnWidth: 4,
                entity: "frenchNoun",
                property: "french",
              })}
              {frenchNoun.uncountable
                ? null
                : Details.renderField.bind(this)({
                    columnWidth: 4,
                    entity: "frenchNoun",
                    property: "frenchPlural",
                  })}
              {Details.renderField.bind(this)({
                columnWidth: 4,
                entity: "frenchNoun",
                property: "note",
              })}
            </div>
            <div className="row">
              {Details.renderField.bind(this)({
                columnWidth: 12,
                entity: "frenchNoun",
                property: "url",
                columnHeader: "Link",
                linkText: frenchNounSaved.url ? "Visit Link" : null,
                linkUrl: frenchNounSaved.url,
              })}
            </div>
            <BottomButtons
              entityName="FrenchNoun"
              confirmDelete={Details.confirmDelete.bind(this)}
              justSaved={justSaved}
              changesToSave={changesToSave}
              disabled={spinner}
              clickSave={() => {
                this.clickSave();
              }}
              marginBottom
            />
            <hr />
            <TagsSection
              entity={frenchNoun}
              entityName="FrenchNoun"
              entityTags={frenchNounTags}
              tags={tags}
              setSpinner={(bool) => this.setState({ spinner: bool })}
              setTags={(entityTags, tags) =>
                this.setState({ frenchNounTags: entityTags, tags })
              }
            />
            <Spinner visible={spinner} />
            <GrayedOut visible={spinner} />
          </div>
          <StreakInfo entity={frenchNoun} />
        </div>
      </>
    );
  }
}
