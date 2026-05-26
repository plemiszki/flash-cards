import React, { useState } from "react";
import { Button, Spinner, GrayedOut, createEntity } from "handy-components";

const CARDS = [
  { question: "When was the 1st Amendment ratified?", answer: "1791" },
  { question: "When was the 2nd Amendment ratified?", answer: "1791" },
  { question: "When was the 3rd Amendment ratified?", answer: "1791" },
  { question: "When was the 4th Amendment ratified?", answer: "1791" },
  { question: "When was the 5th Amendment ratified?", answer: "1791" },
  { question: "When was the 6th Amendment ratified?", answer: "1791" },
  { question: "When was the 7th Amendment ratified?", answer: "1791" },
  { question: "When was the 8th Amendment ratified?", answer: "1791" },
  { question: "When was the 9th Amendment ratified?", answer: "1791" },
  { question: "When was the 10th Amendment ratified?", answer: "1791" },
  { question: "When was the 11th Amendment ratified?", answer: "1795" },
  { question: "When was the 12th Amendment ratified?", answer: "1804" },
  { question: "When was the 13th Amendment ratified?", answer: "1865" },
  { question: "When was the 14th Amendment ratified?", answer: "1868" },
  { question: "When was the 15th Amendment ratified?", answer: "1870" },
  { question: "When was the 16th Amendment ratified?", answer: "1913" },
  { question: "When was the 17th Amendment ratified?", answer: "1913" },
  { question: "When was the 18th Amendment ratified?", answer: "1919" },
  { question: "When was the 19th Amendment ratified?", answer: "1920" },
  { question: "When was the 20th Amendment ratified?", answer: "1933" },
  { question: "When was the 21st Amendment ratified?", answer: "1933" },
  { question: "When was the 22nd Amendment ratified?", answer: "1951" },
  { question: "When was the 23rd Amendment ratified?", answer: "1961" },
  { question: "When was the 24th Amendment ratified?", answer: "1964" },
  { question: "When was the 25th Amendment ratified?", answer: "1967" },
  { question: "When was the 26th Amendment ratified?", answer: "1971" },
  { question: "When was the 27th Amendment ratified?", answer: "1992" },
  {
    question:
      "What does the 1st Amendment protect? List all five freedoms. List all five freedoms.",
    answer:
      "Religion, speech, press,\npeaceful assembly,\npetition the government.",
  },
];

export default function CardAddBulk() {
  const [cards, setCards] = useState(CARDS.map((c) => ({ ...c, result: null, error: null })));
  const [editing, setEditing] = useState(null); // { index, field }
  const [editValue, setEditValue] = useState("");
  const [processing, setProcessing] = useState(false);

  const startEdit = (index, field, currentValue) => {
    setEditing({ index, field });
    setEditValue(currentValue);
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, result: null, error: null } : card))
    );
  };

  const commitEdit = () => {
    if (!editing) return;
    setCards((prev) =>
      prev.map((card, i) =>
        i === editing.index ? { ...card, [editing.field]: editValue } : card,
      ),
    );
    setEditing(null);
  };

  const isEditing = (index, field) =>
    editing && editing.index === index && editing.field === field;

  const deleteCard = (index) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    setProcessing(true);
    const activeIndices = cards.reduce((acc, card, i) => {
      if (card.result !== "success") acc.push(i);
      return acc;
    }, []);
    Promise.all(
      activeIndices.map((i) =>
        createEntity({
          entityName: "card",
          directory: "cards",
          entity: { question: cards[i].question, answer: cards[i].answer },
        })
          .then(() => {
            setCards((prev) =>
              prev.map((c, j) => (j === i ? { ...c, result: "success", error: null } : c))
            );
          })
          .catch((err) => {
            const message = err?.errors ? Object.values(err.errors).flat().join(", ") : "Save failed.";
            setCards((prev) =>
              prev.map((c, j) => (j === i ? { ...c, result: "error", error: message } : c))
            );
          })
      )
    ).finally(() => setProcessing(false));
  };

  const isLong = (value) => value.includes("\n") || value.length > 60;

  const renderField = (card, index, field, isAnswer, locked = false) => {
    const label = field === "question" ? "Question" : "Answer";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          marginTop: isAnswer ? 8 : 0,
          userSelect: "none",
        }}
      >
        <span style={{ fontFamily: "TeachableSans-Bold", flexShrink: 0, textAlign: "right", width: 70 }}>
          {label}:
        </span>
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
                flex: 1,
                resize: "vertical",
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
                flex: 1,
              }}
            />
          )
        ) : (
          <span
            style={{ cursor: locked ? "default" : "pointer", userSelect: "none" }}
            onClick={() => !locked && startEdit(index, field, card[field])}
          >
            {card[field]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="handy-component full-index">
      <h1>Add Cards</h1>
      <div className="white-box">
        <GrayedOut visible={processing} />
        <Spinner visible={processing} />
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card-row"
              style={card.result === "error" ? { border: "1px solid red" } : {}}
            >
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                {card.result === "success" ? (
                  <span style={{ color: "#4caf50", fontSize: 18, userSelect: "none" }}>&#10003;</span>
                ) : (
                  <span
                    onClick={() => deleteCard(index)}
                    style={{ cursor: "pointer", userSelect: "none", fontSize: 16, color: "#aaa" }}
                  >
                    &#128465;
                  </span>
                )}
              </div>
              {renderField(card, index, "question", false, card.result === "success")}
              {renderField(card, index, "answer", true, card.result === "success")}
              {card.result === "error" && (
                <div style={{ marginTop: 8, color: "red", fontSize: 12 }}>{card.error}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button text="Add" onClick={handleAdd} disabled={processing || !cards.some((c) => c.result !== "success")} />
          {cards.some((c) => c.result === "success") && (
            <Button text="Clear Saved" onClick={() => setCards((prev) => prev.filter((c) => c.result !== "success"))} />
          )}
        </div>
      </div>
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
