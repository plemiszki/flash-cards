import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactModal from 'react-modal'
import { FullIndex, SearchIndex, SearchCriteria, SimpleDetails, Message } from 'handy-components'

import NewEntity from './containers/new-entity'
// import NounDetails from './containers/noun-details'
// import VerbDetails from './containers/verb-details'
// import AdjectiveDetails from './containers/adjective-details'
// import SpanishNounDetails from './containers/spanish-noun-details'
// import SpanishVerbDetails from './containers/spanish-verb-details'
// import SpanishAdjectiveDetails from './containers/spanish-adjective-details'
// import SpanishMiscDetails from './containers/spanish-misc-details'
// import CardDetails from './containers/card-details'
// import QuizDetails from './containers/quiz-details'
// import QuizRun from './containers/quiz-run'
// import Vocabulary from './containers/vocabulary'


const renderFullIndex = (id, props = {}, args = {}) => {
  const { newEntity: newEntityProps } = args;
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(
      <FullIndex csrfToken={ true } { ...props }>
        { newEntityProps && (<NewEntity { ...newEntityProps } />) }
      </FullIndex>
    );
  }
}

const renderSimpleDetails = (id, props = {}) => {
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(<SimpleDetails csrfToken={ true } { ...props } />);
  }
}

const renderSearchIndex = (id, props = {}, args = {}) => {
  const { searchCriteria: searchCriteriaProps, newEntity: newEntityProps } = args;
  const node = document.getElementById(id);
  if (node) {
    const root = createRoot(node);
    root.render(
      <SearchIndex csrfToken={ true } { ...props }>
        <SearchCriteria { ...searchCriteriaProps } />
        { newEntityProps && (<NewEntity { ...newEntityProps } />) }
      </SearchIndex>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {

  ReactModal.setAppElement(document.body);

  const messageNode = document.getElementById('message');
  if (messageNode) {
    createRoot(messageNode).render(
      <Message />,
    )
  }

  // if (document.querySelector('#cards-index')) {
  //   ReactDOM.render(
  //     <Provider context={ MyContext } store={ store }>
  //       <SearchIndex
  //         context={ MyContext }
  //         entityName='card'
  //         columns={[
  //           { name: 'question' },
  //           { name: 'tags', width: 300, orderByDisabled: true },
  //           { name: 'streak', width: 100 }
  //         ]}
  //         batchSize={ 50 }
  //         searchModalRows={ 3 }
  //         searchModalDimensions={ { width: 600 } }
  //         showNewButton={ true }
  //         newModalDimensions={ { width: 900, height: 432 } }
  //       >
  //         <SearchCriteria
  //           context={ MyContext }
  //           fields={[
  //             { name: 'question', fuzzy: true, columnWidth: 10 },
  //             { name: 'answer', fuzzy: true, columnWidth: 10 },
  //             { name: 'tag', type: 'modal', optionDisplayProperty: 'name', responseArrayName: 'tags', dbName: 'card_tags.tag_id', columnWidth: 8 },
  //           ]}
  //         />
  //         <NewEntity
  //           context={ MyContext }
  //           initialEntity={ { question: '', answer: '' } }
  //           redirect={ true }
  //         />
  //       </SearchIndex>
  //     </Provider>,
  //     document.querySelector('#cards-index')
  //   );
  // }

  // if (document.querySelector('#card-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <CardDetails entityName='card' array1Name='cardTags' array2Name='tags' />
  //     </Provider>,
  //     document.querySelector('#card-details')
  //   );
  // }

  renderFullIndex('quizzes-index', {
    entityName: 'quiz',
    entityNamePlural: 'quizzes',
    columns: [
      'name',
      { bold: true, isButton: true, buttonText: 'Run Quiz', clickButton: (quiz) => {
        window.location.pathname = `/quizzes/${quiz.id}/run`
      } },
    ],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('tags-index', {
    entityName: 'tag',
    columns: ['name'],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('questions-index', {
    entityName: 'question',
    columns: ['name'],
    modalRows: 1,
    modalDimensions: { width: 700 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { name: '' },
  }});

  renderFullIndex('spanish-nouns-index', {
    entityName: 'spanishNoun',
    columns: ['spanish', 'english', 'streak'],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', englishPlural: '', spanish: '', spanishPlural: '', gender: 1, needsAttention: true },
  }});

  renderFullIndex('spanish-verbs-index', {
    entityName: 'spanishVerb',
    columns: ['spanish', 'english', 'streak', 'forms'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', spanish: '', needsAttention: true },
  }});

  renderFullIndex('spanish-adjectives-index', {
    entityName: 'spanishAdjective',
    columns: [
      { name: 'masculine', header: 'Spanish' },
      { name: 'english' },
      { name: 'streak' },
    ],
    modalRows: 2,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
  }, { newEntity: {
    initialEntity: { english: '', masculine: '', masculinePlural: '', feminine: '', femininePlural: '', needsAttention: true },
  }});

  renderFullIndex('spanish-miscs-index', {
    entityName: 'spanishMisc',
    columns: ['spanish', 'english'],
    modalRows: 1,
    modalDimensions: { width: 900 },
    includeLinks: true,
    includeHover: true,
    includeNewButton: true,
    header: 'Spanish Miscellaneous Words',
  }, { newEntity: {
    initialEntity: { english: '', spanish: '', needsAttention: true },
  }});

  renderSimpleDetails('tag-details', {
    entityName: 'tag',
    initialEntity: { name: '' },
    fields: [[
      { columnWidth: 12, property: 'name' },
    ]],
  });

  renderSimpleDetails('question-details', {
    entityName: 'question',
    initialEntity: { name: '' },
    fields: [[
      { columnWidth: 12, property: 'name' },
    ]],
  });

  // if (document.querySelector('#quiz-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <QuizDetails entityName='quiz' array1Name='quizQuestions' array2Name='questions' array3Name='tags' />
  //     </Provider>,
  //     document.querySelector('#quiz-details')
  //   );
  // }

  // if (document.querySelector('#quiz-run')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <QuizRun entityName='quiz' />
  //     </Provider>,
  //     document.querySelector('#quiz-run')
  //   );
  // }

  // if (document.querySelector('#spanish-noun-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <SpanishNounDetails />
  //     </Provider>,
  //     document.querySelector('#spanish-noun-details')
  //   );
  // }

  // if (document.querySelector('#spanish-verb-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <SpanishVerbDetails />
  //     </Provider>,
  //     document.querySelector('#spanish-verb-details')
  //   );
  // }

  // if (document.querySelector('#spanish-adjective-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <SpanishAdjectiveDetails />
  //     </Provider>,
  //     document.querySelector('#spanish-adjective-details')
  //   );
  // }

  // if (document.querySelector('#spanish-misc-details')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <SpanishMiscDetails />
  //     </Provider>,
  //     document.querySelector('#spanish-misc-details')
  //   );
  // }

  // if (document.querySelector('#vocabulary')) {
  //   ReactDOM.render(
  //     <Provider store={ store }>
  //       <Vocabulary />
  //     </Provider>,
  //     document.querySelector('#vocabulary')
  //   );
  // }
});
