import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Common } from 'handy-components'
import HandyTools from 'handy-tools'
import { runQuiz } from '../actions/index'

class QuizRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      quiz: {},
      questionNumber: 0,
      answer: '',
      matchedItems: {},
      unmatchedItems: [],
      status: 'question',
      showAnswers: false,
      wrongAnswerLog: {}
    };
  }

  componentDidMount() {
    this.props.runQuiz(window.location.pathname.split('/')[2]).then((response) => {
      let matchItems = {};
      this.setState({
        fetching: false,
        quiz: response.quiz
      }, this.setUpMatching.bind(this));
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
    let matchingQuestion = Object.keys(this.state.matchedItems).length > 0;
    if (!matchingQuestion && this.state.answer === '') {
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
        }, this.setUpMatching.bind(this));
      }
    } else {
      let quizQuestion = this.state.quiz.questions[this.state.questionNumber];
      if (quizQuestion.answers.indexOf(this.state.answer) > -1 || (matchingQuestion && this.objectsAreEqual(this.state.matchedItems, quizQuestion.matchBins))) {
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

  objectsAreEqual(obj1, obj2) {
    let result = true;
    Object.keys(obj1).forEach((binName) => {
      let items1 = obj1[binName].sort();
      let items2 = obj2[binName].sort();
      if (JSON.stringify(items1) !== JSON.stringify(items2)) {
        result = false;
      }
    })
    return result;
  }

  setUpMatching() {
    let question = this.state.quiz.questions[this.state.questionNumber];
    if (question.matchBins) {
      let matchBinNames = Object.keys(question.matchBinsShuffled);
      let matchedItems = {};
      let unmatchedItems = [];
      matchBinNames.forEach((binName) => {
        matchedItems[binName] = [];
        unmatchedItems = unmatchedItems.concat(this.state.quiz.questions[this.state.questionNumber].matchBinsShuffled[binName]);
      })
      this.setState({
        matchedItems,
        unmatchedItems: HandyTools.shuffleArray(unmatchedItems)
      }, this.setUpDragAndDrop.bind(this));
    }
  }

  setUpDragAndDrop() {
    $('.unmatched-items-container li').draggable({
      cursor: '-webkit-grabbing',
      helper: () => { return '<div></div>'; },
      stop: this.dragEndHandler
    });
    $('.bins-container li').droppable({
      tolerance: 'pointer',
      over: this.dragOverHandler,
      out: this.dragOutHandler,
      drop: this.dropHandler.bind(this)
    });
  }

  toggleAnswers() {
    this.setState({
      showAnswers: !this.state.showAnswers
    });
  }

  totalWrongAnswers() {
    return Object.keys(this.state.wrongAnswerLog).length;
  }

  selectOption(e) {
    this.setState({
      status: 'question',
      answer: e.target.value
    });
  }

  mouseDownHandler(e) {
    $('input, a, ul, li, .white-box').addClass('grabbing');
    e.target.classList.add('selected');
  }

  mouseUpHandler(e) {
    $('input, a, ul, li, .white-box').removeClass('grabbing');
    e.target.classList.remove('selected');
  }

  dragOverHandler(e) {
    e.target.classList.add('selected');
  }

  dragOutHandler(e) {
    e.target.classList.remove('selected');
  }

  dragEndHandler() {
    $('input, a, ul, li, .white-box').removeClass('grabbing');
    $('li.selected').removeClass('selected');
  }

  dropHandler(e, ui) {
    let binName;
    if (e.target.dataset.name) {
      binName = e.target.dataset.name;
    } else {
      return;
    }
    let itemName = ui.draggable.attr('data-name');
    let unmatchedItems = this.state.unmatchedItems;
    unmatchedItems = HandyTools.removeFromArray(unmatchedItems, itemName);
    let matchedItems = this.state.matchedItems;
    let bin = matchedItems[binName];
    bin.push(itemName);
    let sortedBin = bin.sort();
    matchedItems[binName] = sortedBin;
    this.setState({
      matchedItems,
      unmatchedItems,
      status: 'question'
    });
  }

  removeMatchItem(e) {
    let itemName = e.target.innerHTML;
    let binName = e.target.parentElement.parentElement.dataset.name;
    let unmatchedItems = this.state.unmatchedItems;
    let matchedItems = this.state.matchedItems;
    HandyTools.removeFromArray(matchedItems[binName], itemName);
    unmatchedItems.push(itemName);
    this.setState({
      status: 'question',
      unmatchedItems,
      matchedItems
    }, this.setUpDragAndDrop.bind(this));
  }

  render() {
    return(
      <div id="quiz-run" className="component">
        <h1>{ this.renderHeader() }</h1>
        { this.renderWrongAnswers() }
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <p className="question m-bottom">{ this.renderQuestion() }</p>
          { this.renderImage() }
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

  renderImage() {
    if (this.state.quiz.questions && this.state.quiz.questions[this.state.questionNumber].imageUrl) {
      return(
        <img src={ this.state.quiz.questions[this.state.questionNumber].imageUrl } />
      );
    }
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
    let question;
    if (this.state.quiz.questions) {
      question = this.state.quiz.questions[this.state.questionNumber];
    }
    if (question && question.matchBins && Object.keys(question.matchBins).length > 0) {
      let unmatchedItems = [];
      return([
        <ul key="1" className="bins-container m-bottom">
          { Object.keys(question.matchBinsShuffled).map((binName, index) => {
            return(
              <li key={ index } className="bin" data-name={ binName }>
                { binName }
                { this.renderMatchedItems(binName) }
              </li>
            );
          }) }
        </ul>,
        <ul key="2" className="unmatched-items-container m-bottom">
          { this.state.unmatchedItems.map((itemName, index) => {
            return(
              <li key={ index } className="unmatched-item" onMouseDown={ this.mouseDownHandler } onMouseUp={ this.mouseUpHandler } data-name={ itemName } >
                { itemName }
              </li>
            );
          }) }
        </ul>
      ]);
    } else if (question && question.choices) {
      return(
        <div className="m-bottom">
          { this.state.quiz.questions[this.state.questionNumber].choices.sort().map((choice, index) => {
            return(
              <div key={ index }>
                <input id={ `option-${index}` } onChange={ this.selectOption.bind(this) } checked={ this.state.answer === choice } type="radio" name="choice" value={ choice } /><label htmlFor={`option-${index}`}>{ choice }</label>
              </div>
            );
          })}
        </div>
      );
    } else if (question && question.textbox) {
      return(
        <textarea rows="5" columns="12" className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
      );
    } else {
      return(
        <input className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
      );
    }
  }

  renderMatchedItems(binName) {
    let matchedItems = this.state.matchedItems[binName];
    if (matchedItems && matchedItems.length > 0) {
      return(
        <ul className="bin-items-container">
          { matchedItems.map((itemName, index) => {
            return(
              <li key={ itemName } className="bin-item" onClick={ this.removeMatchItem.bind(this) }>{ itemName }</li>
            );
          }) }
        </ul>
      );
    }
  }

  renderAnswers() {
    if (this.state.quiz.questions && this.state.showAnswers) {
      let question = this.state.quiz.questions[this.state.questionNumber];
      return question.answers.map((answer, index) => {
        if (question.matchBins && Object.keys(question.matchBins).length > 0) {
          return(
            <pre key={ index } className="answer">{ answer }</pre>
          );
        } else {
          return(
            <p key={ index } className="answer">{ answer }</p>
          );
        }
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
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ runQuiz }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizRun);
