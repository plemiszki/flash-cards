import React from "react";

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
];

export default function CardAddBulk() {
  return (
    <div className="handy-component full-index">
      <h1>Add Cards</h1>
      <div className="white-box">
        <div className="cards-grid">
          {CARDS.map((card, index) => (
            <div key={index} className="card-row">
              <div><span className="card-label">Question:</span> {card.question}</div>
              <div className="card-answer"><span className="card-label">Answer:</span> {card.answer}</div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .card-row {
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 12px 16px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .card-answer {
          margin-top: 8px;
        }
        .card-label {
          font-family: "TeachableSans-Bold";
        }
      `}</style>
    </div>
  );
}
