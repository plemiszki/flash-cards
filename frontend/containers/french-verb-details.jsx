import React from "react";
import {
  BottomButtons,
  Button,
  deepCopy,
  Details,
  fetchEntity,
  GrayedOut,
  objectsAreEqual,
  sendRequest,
  setUpNiceSelect,
  Spinner,
  stringifyJSONFields,
  updateEntity,
} from "handy-components";
import TagsSection from "./tags-section";
import StreakInfo from "./streak-info";

export default class FrenchVerbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchVerb = {
      english: "",
      englishSaved: "",
      french: "",
      frenchSaved: "",
    };

    this.state = {
      spinner: true,
      frenchVerb: emptyFrenchVerb,
      frenchVerbSaved: emptyFrenchVerb,
      errors: [],
      frenchVerbTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchVerb: rawfrenchVerb, frenchVerbTags, tags } = response;
      const frenchVerb = stringifyJSONFields({
        entity: rawfrenchVerb,
        jsonFields: ["forms"],
      });
      this.setState(
        {
          spinner: false,
          frenchVerb,
          frenchVerbSaved: deepCopy(frenchVerb),
          tags,
          frenchVerbTags,
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
    return !objectsAreEqual(this.state.frenchVerb, this.state.frenchVerbSaved);
  }

  clickSave() {
    this.setState(
      {
        spinner: true,
        justSaved: true,
      },
      () => {
        updateEntity({
          entityName: "frenchVerb",
          entity: this.state.frenchVerb,
        }).then(
          (response) => {
            const frenchVerb = stringifyJSONFields({
              entity: response.frenchVerb,
              jsonFields: ["forms"],
            });
            this.setState({
              spinner: false,
              frenchVerb,
              frenchVerbSaved: deepCopy(frenchVerb),
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
      frenchVerbTags,
      tags,
      frenchVerb,
      frenchVerbSaved,
    } = this.state;
    return (
      <div className="handy-component">
        <h1>French Verb Details</h1>
        <div className="white-box">
          <div className="row">
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchVerb",
              property: "english",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchVerb",
              property: "french",
            })}
            {Details.renderField.bind(this)({
              columnWidth: 4,
              entity: "frenchVerb",
              property: "note",
            })}
          </div>
          <div className="row" style={{ marginBottom: 30 }}>
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchVerb",
              property: "reflexive",
            })}
            {Details.renderSwitch.bind(this)({
              columnWidth: 2,
              entity: "frenchVerb",
              property: "useEtre",
              columnHeader: "Passé Composé - Être",
            })}
          </div>
          <div className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "frenchVerb",
              property: "forms",
              type: "json",
              rows: 14,
            })}
          </div>
          <div className="row">
            {Details.renderField.bind(this)({
              columnWidth: 12,
              entity: "frenchVerb",
              property: "url",
              columnHeader: "Link",
              linkText: frenchVerbSaved.url ? "Visit Link" : null,
              linkUrl: frenchVerbSaved.url,
              linkNewWindow: true,
            })}
          </div>
          <BottomButtons
            entityName="FrenchVerb"
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
              text="Fetch"
              float
              marginRight
              onClick={() => {
                this.setState({
                  spinner: true,
                });
                sendRequest(`/api/french_verbs/${frenchVerb.id}/fetch`).then(
                  (response) => {
                    const frenchVerb = stringifyJSONFields({
                      entity: response.frenchVerb,
                      jsonFields: ["forms"],
                    });
                    this.setState({
                      spinner: false,
                      frenchVerb,
                      frenchVerbSaved: deepCopy(frenchVerb),
                      changesToSave: false,
                    });
                  },
                  (response) => {
                    const { errors } = response;
                    this.setState({
                      errors,
                    });
                  }
                );
              }}
            />
          </BottomButtons>
          <hr />
          <TagsSection
            entity={frenchVerb}
            entityName="FrenchVerb"
            entityTags={frenchVerbTags}
            tags={tags}
            setSpinner={(bool) => this.setState({ spinner: bool })}
            setTags={(entityTags, tags) =>
              this.setState({ frenchVerbTags: entityTags, tags })
            }
          />
          <Spinner visible={spinner} />
          <GrayedOut visible={spinner} />
        </div>
        <StreakInfo entity={frenchVerb} />
      </div>
    );
  }
}
