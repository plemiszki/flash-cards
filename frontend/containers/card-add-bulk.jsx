import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Spinner,
  GrayedOut,
  createEntity,
  sendRequest,
} from "handy-components";

export default function CardAddBulk() {
  const [prompt, setPrompt] = useState("");
  const [cards, setCards] = useState([]);
  const [editing, setEditing] = useState(null); // { index, field, binIndex? }
  const [editValue, setEditValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
    sendRequest("/api/tags").then(({ tags }) => setAvailableTags(tags));
  }, []);

  const startEdit = (index, field, currentValue, binIndex = null) => {
    setEditing({ index, field, binIndex });
    setEditValue(currentValue);
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, result: null, error: null } : card,
      ),
    );
  };

  const commitEdit = () => {
    if (!editing) return;
    if (editing.field === "matchBinLabel") {
      if (editValue.trim() !== "") {
        setCards((prev) =>
          prev.map((card, i) => {
            if (i !== editing.index) return card;
            const matchBins = card.matchBins.map((bin, j) =>
              j === editing.binIndex ? { ...bin, label: editValue } : bin,
            );
            return { ...card, matchBins };
          }),
        );
      }
    } else if (editing.field === "matchBinItems") {
      setCards((prev) =>
        prev.map((card, i) => {
          if (i !== editing.index) return card;
          const items = editValue
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          const matchBins = card.matchBins.map((bin, j) =>
            j === editing.binIndex ? { ...bin, items } : bin,
          );
          return { ...card, matchBins };
        }),
      );
    } else {
      if (editing.field !== "question" || editValue.trim() !== "") {
        setCards((prev) =>
          prev.map((card, i) =>
            i === editing.index
              ? { ...card, [editing.field]: editValue }
              : card,
          ),
        );
      }
    }
    setEditing(null);
  };

  const isEditing = (index, field, binIndex = null) =>
    editing &&
    editing.index === index &&
    editing.field === field &&
    editing.binIndex === binIndex;

  const deleteCard = (index) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setProcessing(true);
    const activeIndices = cards.reduce((acc, card, i) => {
      if (card.result !== "success") acc.push(i);
      return acc;
    }, []);
    const saveTagsForCard = (cardId, card) => {
      const tagNames = (card.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
      const matchedTags = tagNames.flatMap((name) => {
        const found = availableTags.find(
          (t) => t.name.toLowerCase() === name.toLowerCase(),
        );
        return found ? [found] : [];
      });
      return Promise.all(
        matchedTags.map((tag) =>
          sendRequest("/api/card_tags", {
            method: "POST",
            data: {
              card_tag: {
                tag_id: tag.id,
                cardtagable_id: cardId,
                cardtagable_type: "Card",
              },
            },
          }),
        ),
      );
    };

    const saveCard = (card) => {
      if (card.matchBins) {
        return createEntity({
          entityName: "card",
          directory: "cards",
          entity: { question: card.question, answer: "MATCHING" },
        }).then(({ card: { id: cardId } }) =>
          Promise.all([
            ...card.matchBins.map((bin) =>
              sendRequest("/api/match_bins", {
                method: "POST",
                data: { match_bin: { name: bin.label, card_id: cardId } },
              }).then(({ matchBins }) => {
                const binId = matchBins.find((b) => b.name === bin.label).id;
                return Promise.all(
                  bin.items.map((item) =>
                    sendRequest("/api/match_items", {
                      method: "POST",
                      data: { match_item: { name: item, match_bin_id: binId } },
                    }),
                  ),
                );
              }),
            ),
            saveTagsForCard(cardId, card),
          ]).then(() => cardId),
        );
      }
      return createEntity({
        entityName: "card",
        directory: "cards",
        entity: { question: card.question, answer: card.answer },
      }).then(({ card: { id } }) => saveTagsForCard(id, card).then(() => id));
    };

    Promise.all(
      activeIndices.map((i) =>
        saveCard(cards[i])
          .then((savedId) => {
            setCards((prev) =>
              prev.map((c, j) =>
                j === i ? { ...c, result: "success", error: null, savedId } : c,
              ),
            );
          })
          .catch((err) => {
            const message = err?.errors
              ? Object.values(err.errors).flat().join(", ")
              : "Save failed.";
            setCards((prev) =>
              prev.map((c, j) =>
                j === i ? { ...c, result: "error", error: message } : c,
              ),
            );
          }),
      ),
    ).finally(() => setProcessing(false));
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const submittedPrompt = prompt.trim();
    setGenerating(true);
    setGenerationError("");
    setPrompt("");
    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: submittedPrompt },
    ]);
    sendRequest("/api/card_generations", {
      method: "POST",
      data: { prompt: submittedPrompt, cards },
    })
      .then(({ cards: generated, message }) => {
        if (Array.isArray(generated))
          setCards(
            generated.map((c) => ({
              ...c,
              tags: Array.isArray(c.tags) ? c.tags.join(", ") : (c.tags || ""),
            })),
          );
        setChatHistory((prev) => [...prev, { role: "assistant", message }]);
        textareaRef.current?.focus();
      })
      .catch((err) => {
        setGenerationError(err?.error || "Card generation failed.");
      })
      .finally(() => setGenerating(false));
  };

  const isLong = (value) => value.includes("\n") || value.length > 60;

  const renderMatchBins = (card, cardIndex) => (
    <div style={{ display: "flex", gap: 12 }}>
      {card.matchBins.map((bin, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: "6px 10px",
          }}
        >
          {isEditing(cardIndex, "matchBinLabel", i) ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitEdit()}
              onBlur={commitEdit}
              style={{
                border: "1px solid #aaa",
                borderRadius: 3,
                outline: "none",
                fontSize: "inherit",
                fontFamily: "TeachableSans-Bold",
                padding: "2px 4px",
                width: "100%",
                boxSizing: "border-box",
                marginBottom: 4,
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: "TeachableSans-Bold",
                marginBottom: 4,
                cursor: "pointer",
              }}
              onClick={() =>
                startEdit(cardIndex, "matchBinLabel", bin.label, i)
              }
            >
              {bin.label}
            </div>
          )}
          {isEditing(cardIndex, "matchBinItems", i) ? (
            <textarea
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              style={{
                border: "1px solid #aaa",
                borderRadius: 3,
                outline: "none",
                fontSize: "0.9em",
                fontFamily: "inherit",
                padding: "2px 4px",
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: 60,
              }}
            />
          ) : (
            <div
              style={{ cursor: "pointer", minHeight: 20 }}
              onClick={() =>
                startEdit(cardIndex, "matchBinItems", bin.items.join("\n"), i)
              }
            >
              {bin.items.length === 0 ? (
                <span style={{ color: "#bbb", fontSize: "0.9em" }}>
                  Click to add items...
                </span>
              ) : (
                bin.items.map((item, j) => (
                  <div key={j} style={{ fontSize: "0.9em" }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderField = (card, index, field, locked = false, label = null) => {
    label = label || (field === "question" ? "Question" : "Answer");
    return (
      <React.Fragment key={field}>
        <span
          style={{
            fontFamily: "TeachableSans-Bold",
            textAlign: "right",
            alignSelf: "start",
            userSelect: "none",
          }}
        >
          {label}:
        </span>
        <div style={{ userSelect: "none" }}>
          {!locked && isEditing(index, field) ? (
            isLong(editValue) ? (
              <textarea
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 3,
                  outline: "none",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  width: "100%",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                onBlur={commitEdit}
                style={{
                  border: "1px solid #aaa",
                  borderRadius: 3,
                  outline: "none",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  padding: "4px 8px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            )
          ) : (
            <span
              style={{
                cursor: locked ? "default" : "pointer",
                userSelect: "none",
              }}
              onClick={() => !locked && startEdit(index, field, card[field])}
            >
              {card[field]}
            </span>
          )}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="handy-component full-index">
      <h1>Add Cards</h1>
      <div className="white-box">
        <GrayedOut visible={processing} />
        <Spinner visible={processing} />
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <div className="chat-history-empty">(No chat history)</div>
          ) : (
            chatHistory.map((entry, i) =>
              entry.role === "user" ? (
                <div key={i} className="chat-bubble chat-bubble-user">
                  {entry.content}
                </div>
              ) : (
                <div key={i} className="chat-bubble chat-bubble-assistant">
                  {entry.message}
                </div>
              ),
            )
          )}
          {generating && (
            <div className="chat-bubble chat-bubble-assistant chat-bubble-pending">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={generating}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              e.shiftKey &&
              prompt.trim() &&
              !generating
            ) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          style={{ display: "block", width: "100%", boxSizing: "border-box", marginBottom: 20 }}
        />
        <div style={{ marginBottom: 30 }}>
          <Button
            text="Send"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
          />
        </div>
        {generationError && (
          <div style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
            {generationError}
          </div>
        )}
        <hr />
        {cards.length === 0 && (
          <div
            style={{
              background: "#f0f0f0",
              border: "1px solid lightgray",
              borderRadius: 4,
              padding: "10px 14px",
              color: "black",
            }}
          >
            No cards.
          </div>
        )}
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card-row"
              style={card.result === "error" ? { border: "1px solid red" } : {}}
            >
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                {card.result === "success" ? (
                  <span
                    onClick={() => window.open(`/cards/${card.savedId}`, "_blank")}
                    style={{
                      color: "#4caf50",
                      fontSize: 18,
                      userSelect: "none",
                      cursor: "pointer",
                    }}
                  >
                    &#10003;
                  </span>
                ) : (
                  <span
                    onClick={() => deleteCard(index)}
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      fontSize: 16,
                      color: "#aaa",
                    }}
                  >
                    &#128465;
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "max-content 1fr",
                  columnGap: 6,
                  rowGap: 8,
                }}
              >
                {renderField(
                  card,
                  index,
                  "question",
                  card.result === "success",
                )}
                {card.matchBins ? (
                  <React.Fragment key="matchBins">
                    <span
                      style={{
                        fontFamily: "TeachableSans-Bold",
                        textAlign: "right",
                        alignSelf: "start",
                        userSelect: "none",
                      }}
                    >
                      Matches:
                    </span>
                    <div>{renderMatchBins(card, index)}</div>
                  </React.Fragment>
                ) : (
                  renderField(card, index, "answer", card.result === "success")
                )}
                {renderField(card, index, "tags", card.result === "success", "Tags")}
              </div>
              {card.result === "error" && (
                <div style={{ marginTop: 8, color: "red", fontSize: 12 }}>
                  {card.error}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button
            text="Add"
            onClick={handleAdd}
            disabled={processing || !cards.some((c) => c.result !== "success")}
          />
          {cards.some((c) => c.result === "success") && (
            <Button
              text="Clear Saved"
              onClick={() =>
                setCards((prev) => prev.filter((c) => c.result !== "success"))
              }
            />
          )}
          {cards.some((c) => c.result !== "success") && (
            <Button
              text="Delete All"
              onClick={() =>
                setCards((prev) => prev.filter((c) => c.result === "success"))
              }
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .white-box * {
          user-select: none;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .card-row {
          position: relative;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 12px 56px 12px 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .chat-history {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 8px;
          height: 180px;
          overflow-y: auto;
          border: 1px solid #e4e9ed;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 12px;
          box-sizing: border-box;
        }
        .chat-history-empty {
          margin: auto;
          color: #aaa;
          font-size: 13px;
          user-select: none;
        }
        .chat-bubble {
          max-width: 75%;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          user-select: text;
        }
        .chat-bubble-user {
          align-self: flex-end;
          background: #d1e8ff;
          border-bottom-right-radius: 3px;
        }
        .chat-bubble-assistant {
          align-self: flex-start;
          background: #f0f0f0;
          border-bottom-left-radius: 3px;
        }
        .chat-bubble-pending {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 10px 14px;
        }
        .dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #aaa;
          animation: dot-pulse 1.2s infinite ease-in-out;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
