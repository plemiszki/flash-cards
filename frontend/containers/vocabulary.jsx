import React, { Component } from 'react'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Common, Details } from 'handy-components'
import HandyTools from 'handy-tools'
import ChangeCase from 'change-case'
import JobStatus from './job-status.jsx'
import { createEntity } from '../actions/index'
import { JobModalStyles } from './helpers/modal-styles'

class Vocabulary extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      job: null,
      data: {
        text: ''
      },
      words: null,
      selectedDefs: {}
    };
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: [],
      changesFunction: null
    }
  }

  clickFetchDefinitions() {
    if (this.state.data.text === '') { return; }
    let words = this.state.data.text.split('\n');
    this.setState({
      fetching: true
    }, () => {
      this.props.createEntity({
        directory: 'jobs',
        entityName: 'job',
        entity: {
          name: 'fetch vocabulary'
        },
        additionalData: {
          words
        }
      }).then(() => {
        this.setState({
          fetching: false,
          data: { text: '' },
          job: this.props.job
        });
      });
    });
  }

  clickCreateCards() {
    let data = {};
    let words = this.state.words;
    Object.keys(words).forEach((word) => {
      data[word] = words[word][this.state.selectedDefs[word]];
    });
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory: 'jobs',
      entityName: 'job',
      entity: {
        name: 'create vocabulary cards'
      },
      additionalData: {
        words: data
      }
    }).then(() => {
      this.setState({
        fetching: false,
        job: this.props.job
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
    return(
      <div id="vocabulary" className="component details-component">
        <h1>Bulk Vocabulary Import</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          { this.renderBody.call(this) }
        </div>
        <Modal isOpen={ !!this.state.job } contentLabel="Modal" style={ JobModalStyles }>
          <JobStatus job={ this.state.job } jobDone={ this.jobDone.bind(this) } />
        </Modal>
      </div>
    );
  }

  renderBody() {
    if (this.state.words) {
      return(
        <div className="select-definitions">
          <div className="row">
            <div className="col-xs-12 m-bottom">
              { Object.keys(this.state.words).map((word, index) => {
                if (this.state.words[word]) {
                  return(
                    <div key={ index } className="definitions-container">
                      <p className="word">{ ChangeCase.titleCase(word) }</p>
                      { this.state.words[word].map((def, index) => {
                        let id = `${word}-${index}`;
                        return(
                          <div key={ index }>
                            <input id={ id } type="radio" value={ index } checked={ this.state.selectedDefs[word] === index } onChange={ this.clickRadioButton.bind(this) } data-word={ word } data-index={ index } /><label htmlFor={ id }>{ def }</label>
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
            <a className={ "btn blue-button standard-width" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ this.clickCreateCards.bind(this) }>
              Create Cards
            </a>
          </div>
        </div>
      );
    } else {
      return(
        <div>
          <div className="row">
            <div className="col-xs-12">
              { Details.renderTextBox.bind(this)({ rows: 10, columnWidth: 12, entity: 'data', property: 'text' }) }
            </div>
          </div>
          <div>
            <a className={ "btn blue-button standard-width" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ this.clickFetchDefinitions.bind(this) }>
              Fetch Definitions
            </a>
          </div>
        </div>
      );
    }
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Vocabulary);
