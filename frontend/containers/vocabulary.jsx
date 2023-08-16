import React, { Component } from 'react'
import { Details, createEntity, Spinner, GrayedOut, Button } from 'handy-components'
import { capitalCase } from 'change-case'
import JobStatus from './job-status';

export default class Vocabulary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      job: null,
      data: {
        text: ''
      },
      words: null,
      selectedDefs: {},
      errors: [],
    };
  }

  changeFieldArgs() {
    return {
      changesFunction: null
    }
  }

  clickFetchDefinitions() {
    if (this.state.data.text === '') { return; }
    let words = this.state.data.text.split('\n');
    this.setState({
      spinner: true,
    }, () => {
      createEntity({
        directory: 'jobs',
        entityName: 'job',
        entity: {
          name: 'fetch vocabulary',
        },
        additionalData: {
          words,
        },
      }).then((response) => {
        const { job } = response;
        this.setState({
          spinner: false,
          jobModalOpen: true,
          data: { text: '' },
          job,
        });
      });
    });
  }

  clickCreateCards() {
    let data = {};
    let words = this.state.words;
    Object.keys(words).forEach((word) => {
      if (words[word] !== null) {
        data[word] = words[word][this.state.selectedDefs[word]];
      }
    });
    this.setState({
      spinner: true,
    });
    createEntity({
      directory: 'jobs',
      entityName: 'job',
      entity: {
        name: 'create vocabulary cards'
      },
      additionalData: {
        words: data,
      },
    }).then((response) => {
      const { job } = response;
      this.setState({
        spinner: false,
        job,
      });
    });
  }

  jobDone(job) {
    if (job.name === 'fetch vocabulary') {
      let words = job.metadata;
      let selectedDefs = {};
      Object.keys(words).forEach((word) => { selectedDefs[word] = 0 });
      this.setState({
        job: null,
        words,
        selectedDefs
      });
    } else {
      this.setState({
        job: null,
        words: null,
        selectedDefs: {}
      });
    }
  }

  clickRadioButton(e) {
    let word = e.target.dataset.word;
    let n = parseInt(e.target.dataset.index, 10);
    let selectedDefs = this.state.selectedDefs;
    selectedDefs[word] = n;
    this.setState({
      selectedDefs
    });
  }

  render() {
    const { spinner, words, selectedDefs, job, jobModalOpen } = this.state;
    return (
      <div className="handy-component">
        <h1>Bulk Vocabulary Import</h1>
        <div className="white-box">
          { this.renderBody.call(this) }
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        { job && (
          <JobStatus
            job={ job }
            isOpen={ jobModalOpen }
            jobDone={ this.jobDone.bind(this) }
          />
        ) }
      </div>
    );
  }

  renderBody() {
    const { words, selectedDefs, spinner } = this.state;
    if (words) {
      return (
        <>
          <div className="select-definitions">
            <div className="row">
              <div className="col-xs-12 m-bottom">
                { Object.keys(words).map((word, index) => {
                  if (words[word]) {
                    return(
                      <div key={ index } className="definitions-container">
                        <p className="word">{ capitalCase(word) }</p>
                        { words[word].map((def, index) => {
                          let id = `${word}-${index}`;
                          return (
                            <div key={ index } className="definition">
                              <input id={ id } type="radio" value={ index } checked={ selectedDefs[word] === index } onChange={ this.clickRadioButton.bind(this) } data-word={ word } data-index={ index } />
                              <label htmlFor={ id }>{ def }</label>
                            </div>
                          );
                        }) }
                      </div>
                    );
                  }
                }) }
              </div>
            </div>
            <div>
              <Button
                disabled={ spinner }
                onClick={ () => { this.clickCreateCards() } }
                text="Create Cards"
              />
            </div>
          </div>
          <style jsx>{`
            p.word {
              color: black;
              font-size: 16px;
              font-family: 'TeachableSans-SemiBold';
              margin-bottom: 10px;
            }
            .definitions-container {
              margin-bottom: 30px;
            }
            .definition {
              margin-bottom: 4px;
            }
            input {
              display: inline-block;
              height: 20px;
              margin-right: 10px;
              vertical-align: top;
            }
            label {
              display: inline-block;
              vertical-align: top;
              font-size: 14px;
              line-height: 20px;
              width: calc(100% - 23px);
            }
          `}</style>
        </>
      );
    } else {
      return (
        <div>
          <div className="row">
            <div className="col-xs-12">
              { Details.renderField.bind(this)({
                type: 'textbox',
                rows: 10,
                columnWidth: 12,
                entity: 'data',
                property: 'text',
              }) }
            </div>
          </div>
          <div>
            <Button
              disabled={ spinner }
              onClick={ () => { this.clickFetchDefinitions() } }
              text="Fetch Definitions"
            />
          </div>
        </div>
      );
    }
  }
}
