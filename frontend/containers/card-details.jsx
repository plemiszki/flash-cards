import React from "react";
import Modal from "react-modal";
import {
  setUpNiceSelect,
  Common,
  Details,
  Spinner,
  GrayedOut,
  fetchEntity,
  updateEntity,
  deleteEntity,
  BottomButtons,
  objectsAreEqual,
  deepCopy,
  OutlineButton,
  Table,
  Button,
} from "handy-components";
import NewEntity from "./new-entity.jsx";
import TagsSection from "./tags-section";
import StreakInfo from "./streak-info";

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyCard = {
      question: "",
      answer: "",
    };

    this.state = {
      spinner: true,
      card: emptyCard,
      cardSaved: emptyCard,
      cardTags: [],
      errors: [],
      matchBins: [],
      newCardTagModalOpen: false,
      tags: [],
      newEntityModalOpen: false,
    };
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    fetchEntity().then((response) => {
      const { card, cardTags, tags, matchBins } = response;
      this.setState(
        {
          spinner: false,
          card,
          cardSaved: deepCopy(card),
          cardTags,
          tags,
          matchBins,
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

  componentWillUnmount() {
    const script = document.querySelector(
      'script[src="https://upload-widget.cloudinary.com/global/all.js"]'
    );
    if (script) {
      script.remove();
    }
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this),
    };
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.card, this.state.cardSaved);
  }

  clickSave() {
    const { card } = this.state;
    this.setState(
      {
        spinner: true,
        justSaved: true,
      },
      () => {
        updateEntity({
          entityName: "card",
          entity: card,
          jsonFieldsToConvert: ["config"],
        }).then(
          (response) => {
            const { card } = response;
            this.setState({
              spinner: false,
              card,
              cardSaved: deepCopy(card),
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

  clickUploadImage() {
    const { card } = this.state;
    window.cloudinary.openUploadWidget(
      {
        cloudName: "duzqplbgf",
        uploadPreset: "flashcards",
        sources: ["local"],
      },
      (error, result) => {
        if (!error && result.event === "success") {
          const url = result.info.secure_url;
          card.cloudinaryUrl = url;
          console.log("card", card);
          this.setState({
            card,
            changesToSave: true,
          });
        }
      }
    );
  }

  updateMatchBins(response) {
    this.setState({
      newMatchBinModalOpen: false,
      newMatchItemModalOpen: false,
      matchBins: response,
    });
  }

  render() {
    const {
      spinner,
      card,
      cardSaved,
      cardTags,
      tags,
      justSaved,
      changesToSave,
      matchBins,
      newMatchBinModalOpen,
      newMatchItemModalOpen,
      selectedMatchBinId,
      newEntityModalOpen,
    } = this.state;
    const answerCharacters = card.answer.split("");
    const answerIsRegEx =
      answerCharacters[0] === "/" &&
      answerCharacters[answerCharacters.length - 1] === "/";

    let matchBinsRows = [];
    matchBins.forEach((matchBin) => {
      matchBinsRows.push({
        text: matchBin.name,
        type: "bin",
        id: matchBin.id,
      });
      matchBin.matchItems.forEach((matchItem) => {
        matchBinsRows.push({
          text: matchItem.name,
          type: "item",
          id: matchItem.id,
        });
      });
    });

    return (
      <>
        <div className="handy-component">
          <h1>Card Details</h1>
          <Button
            text="Add Card"
            onClick={() => this.setState({ newEntityModalOpen: true })}
            float
          />
          <div className="white-box">
            <div className="row">
              {Details.renderField.bind(this)({
                columnWidth: 6,
                entity: "card",
                property: "question",
              })}
              {Details.renderField.bind(this)({
                columnWidth: 6,
                entity: "card",
                property: "hint",
              })}
            </div>
            <div className="row">
              {Details.renderField.bind(this)({
                columnWidth: 6,
                entity: "card",
                property: "cloudinaryUrl",
                uploadLinkFunction: this.clickUploadImage.bind(this),
              })}
              {Details.renderField.bind(this)({
                columnWidth: 6,
                entity: "card",
                property: "notes",
                columnHeader: "Note",
              })}
            </div>
            <div className="row">
              <div className="col-xs-3">
                <img src={card.cloudinaryUrl} />
              </div>
            </div>
            <div className="row">
              {Details.renderField.bind(this)({
                type: "textbox",
                rows: 5,
                columnWidth: 5,
                entity: "card",
                property: "answer",
                styles: answerIsRegEx
                  ? {
                      fontSize: 16,
                      fontFamily: "Inconsolata",
                    }
                  : {},
              })}
              {Details.renderField.bind(this)({
                type: "textbox",
                rows: 5,
                columnWidth: 5,
                entity: "card",
                property: "answerPlaceholder",
              })}
              {Details.renderSwitch.bind(this)({
                columnWidth: 2,
                entity: "card",
                property: "multipleChoice",
              })}
            </div>
            <div className="row switches">
              {Details.renderSwitch.bind(this)({
                columnWidth: 2,
                entity: "card",
                property: "config",
                nestedKeys: ["options", "inconsolata"],
                columnHeader: "Inconsolata",
              })}
              {Details.renderSwitch.bind(this)({
                columnWidth: 2,
                entity: "card",
                property: "config",
                nestedKeys: ["options", "lineCount"],
                columnHeader: "Line Count",
              })}
              {Details.renderSwitch.bind(this)({
                columnWidth: 2,
                entity: "card",
                property: "config",
                nestedKeys: ["options", "noRepeat"],
                columnHeader: "Do Not Repeat",
              })}
              {Details.renderSwitch.bind(this)({
                columnWidth: 3,
                entity: "card",
                property: "config",
                nestedKeys: ["options", "screamingSnake"],
                columnHeader: "Screaming Snake Case",
              })}
            </div>
            <BottomButtons
              entityName="card"
              confirmDelete={Details.confirmDelete.bind(this)}
              justSaved={justSaved}
              changesToSave={changesToSave}
              disabled={spinner}
              clickSave={() => {
                this.clickSave();
              }}
              marginBottom
            />
            {cardSaved.answer === "MATCHING" && (
              <>
                <hr />
                <Table
                  columns={[
                    {
                      name: "text",
                      header: "Match Bins",
                      boldIf: (row) => row.type === "bin",
                    },
                    {
                      isButton: true,
                      buttonText: "Add Item",
                      width: 120,
                      clickButton: (row) => {
                        this.setState({
                          newMatchItemModalOpen: true,
                          selectedMatchBinId: row.id,
                        });
                      },
                      displayIf: (row) => row.type === "bin",
                    },
                  ]}
                  rows={matchBinsRows}
                  links={false}
                  sortable={false}
                  clickDelete={(row) => {
                    const { type, id } = row;
                    this.setState({ spinner: true });
                    if (type === "bin") {
                      deleteEntity({
                        directory: "match_bins",
                        id,
                      }).then((response) => {
                        this.setState({
                          spinner: false,
                          matchBins: response.matchBins,
                        });
                      });
                    } else {
                      deleteEntity({
                        directory: "match_items",
                        id,
                      }).then((response) => {
                        this.setState({
                          spinner: false,
                          matchBins: response.matchBins,
                        });
                      });
                    }
                  }}
                  marginBottom
                />
                <OutlineButton
                  color="#5F5F5F"
                  text="Add Bin"
                  onClick={() => this.setState({ newMatchBinModalOpen: true })}
                  marginBottom
                />
              </>
            )}
            <hr />
            <TagsSection
              entity={card}
              entityName="Card"
              entityTags={cardTags}
              tags={tags}
              setSpinner={(bool) => this.setState({ spinner: bool })}
              setTags={(entityTags, tags) =>
                this.setState({ cardTags: entityTags, tags })
              }
            />
            <Spinner visible={spinner} />
            <GrayedOut visible={spinner} />
          </div>
          <StreakInfo entity={card} />
          <Modal
            isOpen={newMatchBinModalOpen}
            onRequestClose={Common.closeModals.bind(this)}
            contentLabel="Modal"
            style={Common.newEntityModalStyles({ width: 500 }, 1)}
          >
            <NewEntity
              entityName="matchBin"
              initialEntity={{ cardId: card.id, name: "" }}
              callback={this.updateMatchBins.bind(this)}
            />
          </Modal>
          <Modal
            isOpen={newMatchItemModalOpen}
            onRequestClose={Common.closeModals.bind(this)}
            contentLabel="Modal"
            style={Common.newEntityModalStyles({ width: 500 }, 1)}
          >
            <NewEntity
              entityName="matchItem"
              initialEntity={{ matchBinId: selectedMatchBinId, name: "" }}
              callback={this.updateMatchBins.bind(this)}
              responseKey="matchBins"
            />
          </Modal>
          <Modal
            isOpen={newEntityModalOpen}
            onRequestClose={() => {
              this.setState({ newEntityModalOpen: false });
            }}
            style={Common.newEntityModalStyles({ width: 900, height: 551 })}
          >
            <NewEntity
              entityName="card"
              fetchData={["tags"]}
              initialEntity={{
                question: "",
                answer: "",
              }}
              redirectAfterCreate={true}
            />
          </Modal>
        </div>
        <style jsx>{`
          img,
          .switches {
            margin-bottom: 30px;
          }
          img {
            max-width: 100%;
          }
        `}</style>
      </>
    );
  }
}
