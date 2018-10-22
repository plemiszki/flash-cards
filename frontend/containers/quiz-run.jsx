import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HandyTools from 'handy-tools';
import { runQuiz } from '../actions/index';
import Common from './modules/common.js';

class QuizRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      quiz: {},
      questionNumber: 0,
      answer: '',
      status: 'question',
      showAnswers: false
    };
  }

  componentDidMount() {
    this.props.runQuiz(window.location.pathname.split('/')[2]).then((response) => {
      this.setState({
        fetching: false,
        quiz: response.quiz
      });
    });
  }

  changeAnswer(e) {
    this.setState({
      answer: e.target.value,
      status: 'question'
    });
  }

  checkAnswer(e) {
    e.preventDefault();
    if (this.state.answer === '') {
      return;
    }
    if (this.state.status === 'correct') {
      if (this.state.questionNumber + 1 === this.state.quiz.questions.length) {
        window.location.pathname = '/quizzes';
      } else {
        this.setState({
          questionNumber: this.state.questionNumber += 1,
          answer: '',
          status: 'question',
          showAnswers: false
        });
      }
    } else {
      let quizQuestion = this.state.quiz.questions[this.state.questionNumber];
      if ([quizQuestion.answerTransliterated, quizQuestion.answerHindi].indexOf(this.state.answer) > -1) {
        this.setState({
          status: 'correct'
        });
      } else {
        this.setState({
          status: 'wrong'
        });
      }
    }
  }

  toggleAnswers() {
    this.setState({
      showAnswers: !this.state.showAnswers
    });
  }

  render() {
    return (
      <div id="quiz-run" className="component">
        <h1>{ this.renderHeader() }</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <p className="question m-bottom">{ this.renderQuestion() }</p>
          <form>
            <input className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
            { this.renderAnswers() }
            <input type="submit" className={ this.buttonClass() + " standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ this.checkAnswer.bind(this) } value={ this.state.status === 'correct' ? 'Next Question' : 'Check Answer' } />
            <a className="gray-outline-button float-button small-padding small-width" onClick={ this.toggleAnswers.bind(this) }>{ this.state.showAnswers ? 'Hide Answers' : 'Show Answers' }</a>
          </form>
        </div>
      </div>
    );
  }

  buttonClass() {
    switch (this.state.status) {
      case 'correct':
        return 'green-button';
      case 'wrong':
        return 'red-button';
      default:
        return 'blue-button';
    }
  }

  renderHeader() {
    if (this.state.quiz.name) {
      return `${this.state.quiz.name} - ${this.state.questionNumber + 1}/${this.state.quiz.questions.length}`
    } else {
      return '';
    }
  }

  renderQuestion() {
    if (this.state.quiz.questions) {
      return this.state.quiz.questions[this.state.questionNumber].question;
    } else {
      return '';
    }
  }

  renderAnswers() {
    if (this.state.quiz.questions && this.state.showAnswers) {
      return([
        <p className="answer">{ this.state.quiz.questions[this.state.questionNumber].answerHindi }</p>,
        <p className="answer">{ this.state.quiz.questions[this.state.questionNumber].answerTransliterated }</p>
      ]);
    } else {
      return '';
    }
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return {
    quiz: reducers.standardReducer.entity
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ runQuiz }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizRun);
