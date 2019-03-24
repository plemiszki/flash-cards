import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HandyTools from 'handy-tools';
import { Common } from 'handy-components';
import { runQuiz } from '../actions/index';
import FlashCardsCommon from './modules/common.js';

class QuizRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      quiz: {},
      questionNumber: 0,
      answer: '',
      status: 'question',
      showAnswers: false,
      wrongAnswerLog: {}
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
        if (this.totalWrongAnswers() > 0) {
          let total = this.state.quiz.questions.length;
          let correct = total - this.totalWrongAnswers();
          let percentage = Math.floor((correct / total) * 100);
          let firstLine = `${this.totalWrongAnswers()} wrong answers - ${percentage}% correct`;
          let messageLines = [firstLine];
          Object.keys(this.state.wrongAnswerLog).forEach((key) => {
            messageLines.push(this.state.quiz.questions[key].question);
          });
          let color;
          if (percentage >= 80) {
            color = 'light-green';
          } else if (percentage >= 70) {
            color = 'yellow';
          } else {
            color = 'red';
          }
          localStorage.setItem('message', messageLines.join("\n"));
          localStorage.setItem('message-color', color);
        } else {
          localStorage.setItem('message', 'Great job. You aced the quiz!');
          localStorage.setItem('message-color', 'green');
        }
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
      if (quizQuestion.answers.indexOf(this.state.answer) > -1) {
        this.setState({
          status: 'correct'
        });
      } else {
        let wrongAnswerLog = this.state.wrongAnswerLog;
        wrongAnswerLog[this.state.questionNumber] = 'wrong';
        this.setState({
          status: 'wrong',
          wrongAnswerLog
        });
      }
    }
  }

  toggleAnswers() {
    this.setState({
      showAnswers: !this.state.showAnswers
    });
  }

  totalWrongAnswers() {
    return Object.keys(this.state.wrongAnswerLog).length;
  }

  render() {
    return (
      <div id="quiz-run" className="component">
        <h1>{ this.renderHeader() }</h1>
        { this.renderWrongAnswers() }
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <p className="question m-bottom">{ this.renderQuestion() }</p>
          <form>
            { this.renderInput() }
            { this.renderAnswers() }
            <input type="submit" className={ this.buttonClass() + " standard-width" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ this.checkAnswer.bind(this) } value={ this.state.status === 'correct' ? 'Next Question' : 'Check Answer' } />
            <a className="gray-outline-button float-button small-padding small-width" onClick={ this.toggleAnswers.bind(this) }>{ this.state.showAnswers ? 'Hide Answers' : 'Show Answers' }</a>
          </form>
        </div>
      </div>
    );
  }

  renderWrongAnswers() {
    let count = this.totalWrongAnswers();
    if (count > 0) {
      return (
        <p className="wrong-count">Wrong: { count }</p>
      );
    }
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

  renderInput() {
    if (this.state.quiz.questions && this.state.quiz.questions[this.state.questionNumber].textbox) {
      return(
        <textarea rows="5" columns="12" className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
      );
    } else {
      return(
        <input className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
      );
    }
  }

  renderAnswers() {
    if (this.state.quiz.questions && this.state.showAnswers) {
      return this.state.quiz.questions[this.state.questionNumber].answers.map(function(answer, index) {
        return(
          <p key={ index } className="answer">{ answer }</p>
        );
      });
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
