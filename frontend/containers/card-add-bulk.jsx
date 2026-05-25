import React, { useState } from "react";
import { Button, Common } from "handy-components";

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
  const [cards, setCards] = useState(CARDS.map((c) => ({ ...c, active: true })));
  const [editing, setEditing] = useState(null); // { index, field }
  const [editValue, setEditValue] = useState("");

  const startEdit = (index, field, currentValue) => {
    setEditing({ index, field });
    setEditValue(currentValue);
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

  const toggleActive = (index) => {
    setCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, active: !card.active } : card
      )
    );
  };

  const isLong = (value) => value.includes("\n") || value.length > 60;

  const renderField = (card, index, field, isAnswer) => {
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
        {isEditing(index, field) ? (
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
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => startEdit(index, field, card[field])}
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
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div key={index} className="card-row">
              <div style={{ position: "absolute", top: 10, right: 12 }}>
                {Common.renderSwitchComponent({
                  checked: card.active,
                  onChange: () => toggleActive(index),
                  height: 18,
                  width: 32,
                  circleSize: 10,
                })}
              </div>
              {renderField(card, index, "question", false)}
              {renderField(card, index, "answer", true)}
            </div>
          ))}
        </div>
        <Button text="Add" style={{ marginTop: 20 }} />
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
