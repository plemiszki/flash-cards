import React, { useState, useEffect } from "react";
import {
  Spinner,
  GrayedOut,
  SearchBar,
  Table,
  setUpNiceSelect,
} from "handy-components";

const TRUNCATE_MAX = 80;

const truncateQuestion = (row) => {
  if (!row.question) return "";
  if (row.question.length <= TRUNCATE_MAX) return row.question;
  return (
    <span title={row.question}>{row.question.slice(0, TRUNCATE_MAX)}...</span>
  );
};

const ENTITY_CONFIGS = {
  Card: {
    label: "Cards",
    urlPrefix: "cards",
    columns: [
      { name: "question", displayFunction: truncateQuestion },
      { name: "tags", orderByDisabled: true },
      { name: "streak", width: 100 },
    ],
  },
  FrenchNoun: {
    label: "French Nouns",
    urlPrefix: "french_nouns",
    columns: ["french", "english", "gender", { name: "streak", width: 100 }],
  },
  FrenchVerb: {
    label: "French Verbs",
    urlPrefix: "french_verbs",
    columns: ["french", "english", { name: "streak", width: 100 }],
  },
  FrenchAdjective: {
    label: "French Adjectives",
    urlPrefix: "french_adjectives",
    columns: [
      { name: "masculine", header: "French" },
      "english",
      { name: "streak", width: 100 },
    ],
  },
  FrenchCity: {
    label: "French Cities",
    urlPrefix: "french_cities",
    columns: ["french", "english", { name: "streak", width: 100 }],
  },
  FrenchCountry: {
    label: "French Countries",
    urlPrefix: "french_countries",
    columns: ["french", "english", "gender", { name: "streak", width: 100 }],
  },
  FrenchMisc: {
    label: "French Misc",
    urlPrefix: "french_miscs",
    columns: ["french", "english", { name: "streak", width: 100 }],
  },
  SpanishNoun: {
    label: "Spanish Nouns",
    urlPrefix: "spanish_nouns",
    columns: ["spanish", "english", { name: "streak", width: 100 }],
  },
  SpanishVerb: {
    label: "Spanish Verbs",
    urlPrefix: "spanish_verbs",
    columns: ["spanish", "english", { name: "streak", width: 100 }, "forms"],
  },
  SpanishAdjective: {
    label: "Spanish Adjectives",
    urlPrefix: "spanish_adjectives",
    columns: [
      { name: "masculine", header: "Spanish" },
      "english",
      { name: "streak", width: 100 },
    ],
  },
  SpanishMisc: {
    label: "Spanish Misc",
    urlPrefix: "spanish_miscs",
    columns: ["spanish", "english"],
  },
};

export default function HighlightsIndex() {
  const [spinner, setSpinner] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [entity, setEntity] = useState("Card");

  useEffect(() => {
    setUpNiceSelect({
      selector: "#entity-select",
      func: (e) => setEntity(e.target.value),
    });
  }, []);

  useEffect(() => {
    setSpinner(true);
    setSearchText("");
    fetch(`/api/highlights?entity=${entity}`)
      .then((res) => res.json())
      .then((response) => {
        setHighlights(response.highlights);
        setSpinner(false);
      });
  }, [entity]);

  const config = ENTITY_CONFIGS[entity];

  return (
    <div className="handy-component full-index">
      <div className="highlights-header">
        <h1>Highlighted {config.label}</h1>
        <div className="highlights-header-right">
          <SearchBar
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <select id="entity-select" defaultValue="Card">
            {Object.entries(ENTITY_CONFIGS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="white-box">
        <GrayedOut visible={spinner} />
        <Spinner visible={spinner} />
        <Table
          key={entity}
          columns={config.columns}
          rows={highlights}
          searchText={searchText}
          urlPrefix={config.urlPrefix}
          urlProperty="highlightableId"
          alphabetize={true}
        />
      </div>
      <style jsx>{`
        .highlights-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .highlights-header h1 {
          margin: 0;
        }
        .highlights-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .highlights-header .nice-select {
          width: 200px;
        }
      `}</style>
    </div>
  );
}
