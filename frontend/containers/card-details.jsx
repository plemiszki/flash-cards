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
  sendRequest,
  BottomButtons,
  objectsAreEqual,
  deepCopy,
  OutlineButton,
  Button,
  ConfirmDelete,
} from "handy-components";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
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
      highlighted: false,
      highlightId: null,
      matchBins: [],
      confirmDeleteBinId: null,
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
      const { card, cardTags, highlighted, highlightId, tags, matchBins } =
        response;
      this.setState(
        {
          spinner: false,
          card,
          cardSaved: deepCopy(card),
          cardTags,
          highlighted,
          highlightId,
          tags,
          matchBins,
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

  componentWillUnmount() {
    const script = document.querySelector(
      'script[src="https://upload-widget.cloudinary.com/global/all.js"]',
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
          },
        );
      },
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
      },
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
      highlighted,
      highlightId,
      tags,
      justSaved,
      changesToSave,
      matchBins,
      confirmDeleteBinId,
      newMatchBinModalOpen,
      newMatchItemModalOpen,
      selectedMatchBinId,
      newEntityModalOpen,
    } = this.state;
    const answerCharacters = card.answer.split("");
    const answerIsRegEx =
      answerCharacters[0] === "/" &&
      answerCharacters[answerCharacters.length - 1] === "/";

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
            {card.cloudinaryUrl && (
              <div className="row">
                <div className="col-xs-3">
                  <img src={card.cloudinaryUrl} />
                </div>
              </div>
            )}
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
            <div className="row">
              <div className="col-xs-12">
                <div
                  className={`highlight-status ${highlighted ? "highlight-status-active" : ""}`}
                >
                  {highlighted
                    ? "This card is highlighted."
                    : "This card is not highlighted."}
                  <span
                    className="highlight-toggle"
                    onClick={() => {
                      if (highlighted) {
                        sendRequest(`/api/highlights/${highlightId}`, {
                          method: "DELETE",
                        }).then(() => {
                          this.setState({
                            highlighted: false,
                            highlightId: null,
                          });
                        });
                      } else {
                        sendRequest("/api/highlights", {
                          method: "POST",
                          data: {
                            highlight: {
                              highlightable_type: "Card",
                              highlightable_id: card.id,
                            },
                          },
                        }).then((response) => {
                          this.setState({
                            highlighted: true,
                            highlightId: response.id,
                          });
                        });
                      }
                    }}
                  >
                    {highlighted ? "Remove Highlight" : "Highlight"}
                  </span>
                </div>
              </div>
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
                <div className="match-bins-header">Match Bins</div>
                <div className="match-bins-grid">
                  {matchBins.map((bin) => (
                    <div key={bin.id} className="match-bin-container">
                      <div className="match-bin-header">
                        <div className="match-bin-name">{bin.name}</div>
                        <div className="match-bin-icons">
                          <AddIcon
                            className="match-bin-icon"
                            sx={{ cursor: "pointer" }}
                            onClick={() => this.setState({ newMatchItemModalOpen: true, selectedMatchBinId: bin.id })}
                          />
                          <ClearIcon
                            className="match-bin-icon"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                              if (bin.matchItems.length > 0) {
                                this.setState({ confirmDeleteBinId: bin.id });
                              } else {
                                this.setState({ spinner: true });
                                deleteEntity({ directory: "match_bins", id: bin.id }).then((response) => {
                                  this.setState({ spinner: false, matchBins: response.matchBins });
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                      {bin.matchItems.map((item) => (
                        <div key={item.id} className="match-bin-item">
                          <span>{item.name}</span>
                          <span className="match-item-delete-icon">
                            <ClearIcon
                              sx={{ cursor: "pointer", fontSize: 14 }}
                              onClick={() => {
                                this.setState({ spinner: true });
                                deleteEntity({ directory: "match_items", id: item.id }).then((response) => {
                                  this.setState({ spinner: false, matchBins: response.matchBins });
                                });
                              }}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
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
              buttonText="Add Bin"
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
              buttonText="Add Item"
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
          <ConfirmDelete
            isOpen={confirmDeleteBinId !== null}
            closeModal={() => this.setState({ confirmDeleteBinId: null })}
            entityName="matchBin"
            confirmDelete={() => {
              this.setState({ spinner: true, confirmDeleteBinId: null });
              deleteEntity({ directory: "match_bins", id: confirmDeleteBinId }).then((response) => {
                this.setState({ spinner: false, matchBins: response.matchBins });
              });
            }}
          />
        </div>
        <style jsx>{`
          img,
          .switches {
            margin-bottom: 30px;
          }
          img {
            max-width: 100%;
          }
          .highlight-status {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-family: "TeachableSans-Medium";
            font-size: 12px;
            color: #2c2f33;
            margin-bottom: 30px;
          }
          .highlight-status-active {
            background: #fffde7;
            border-color: #f9c700;
          }
          .highlight-toggle {
            cursor: pointer;
            text-decoration: underline;
          }
          .match-bins-header {
            font-family: "TeachableSans-SemiBold";
            color: black;
            font-size: 12px;
            padding-left: 10px;
            margin-bottom: 20px;
          }
          .match-bins-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            margin-bottom: 30px;
          }
          .match-bin-container {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 12px;
          }
          .match-bin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .match-bin-icons {
            display: none;
            gap: 6px;
          }
          .match-bin-container:hover .match-bin-icons {
            display: flex;
          }
          .match-bin-icon {
            cursor: pointer;
            font-size: 15px;
            user-select: none;
            color: #96939b;
          }
          .match-bin-icon:hover {
            color: black;
          }
          .match-bin-name {
            font-family: "TeachableSans-SemiBold";
            color: black;
            font-size: 12px;
            user-select: none;
          }
          .match-bin-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #96939b;
            line-height: 17px;
            margin-bottom: 4px;
            user-select: none;
          }
          .match-item-delete-icon {
            display: none;
            line-height: 0;
          }
          .match-bin-item:hover .match-item-delete-icon {
            display: inline;
          }
        `}</style>
      </>
    );
  }
}
