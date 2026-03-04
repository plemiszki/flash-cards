import React, { useState, useEffect } from 'react';
import { Spinner, GrayedOut, SearchBar, Table } from 'handy-components';

export default function HighlightsIndex() {
  const [spinner, setSpinner] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('/api/highlights?entity=Card')
      .then(res => res.json())
      .then((response) => {
        setHighlights(response.highlights);
        setSpinner(false);
      });
  }, []);

  return (
    <div className="handy-component full-index">
      <h1>Highlighted Cards</h1>
      <SearchBar
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
      <div className="white-box">
        <GrayedOut visible={spinner} />
        <Spinner visible={spinner} />
        <Table
          columns={[
            {
              name: 'question',
              displayFunction: (row) => {
                const MAX = 80;
                if (row.question.length <= MAX) return row.question;
                return <span title={row.question}>{row.question.slice(0, MAX)}...</span>;
              },
            },
            { name: 'tags', width: 300, orderByDisabled: true },
            { name: 'streak', width: 100 },
          ]}
          rows={highlights}
          searchText={searchText}
          urlPrefix="cards"
          urlProperty="highlightableId"
          alphabetize={true}
        />
      </div>
    </div>
  );
}
