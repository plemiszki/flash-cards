import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Common } from 'handy-components'
import HandyTools from 'handy-tools'
import { createEntity, updateEntity, deleteEntity, runQuiz } from '../actions/index'
import ChangeCase from 'change-case'

class QuizRun extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      errors: [],
      quiz: {},
      questionNumber: 0,
      answer: '',
      matchedItems: {},
      unmatchedItems: [],
      status: 'question',
      streak: 0,
      showAnswers: false,
      wrongAnswerLog: {},
      renderUnarchiveButton: true
    };
  }

  componentDidMount() {
    this.props.runQuiz(window.location.pathname.split('/')[2]).then(() => {
      let matchItems = {};
      this.setState({
        fetching: false,
        quiz: this.props.quiz,
        answer: this.props.quiz.questions[0].answerPlaceholder,
      }, this.setUpMatching.bind(this));
    }, () => {
      this.setState({
        errors: this.props.errors
      })
    });
  }

  changeAnswer(e) {
    let answer = e.target.value;
    if (answer.charAt(answer.length - 1) === '`') {
      answer = answer.slice(0, -1);
    }
    this.setState({
      answer,
      status: 'question'
    });
  }

  checkKey(e) {
    if (e.charCode === 96) {
      this.toggleAnswers.call(this);
    }
  }

  updateStreak(status) {
    let question = this.state.quiz.questions[this.state.questionNumber];
    let directory;
    let id;
    let entityName;

    if (question.cardId) {
      directory = 'cards';
      id = question.cardId;
      entityName = 'card';
    } else if (question.wordId) {
      directory = `${ChangeCase.snakeCase(question.entity)}s`;
      id = question.wordId;
      entityName = question.entity;
    }

    let entity = {};
    let newStreak;
    if (status === 'correct') {
      newStreak = +question.streak + 1;
      entity.streak = newStreak;
    } else {
      entity.streak = 0;
    }

    this.setState({ streak: newStreak });
    entity.lastStreakAdd = (new Date().setHours(0, 0, 0, 0) / 1000);
    this.props.updateEntity({
      directory,
      id,
      entityName,
      entity
    });
  }

  clickCheckAnswer(e) {
    e.preventDefault();
    let matchingQuestion = Object.keys(this.state.matchedItems).length > 0;
    if (!matchingQuestion && this.state.answer === '') {
      return;
    }
    if (this.state.status === 'correct') { // next question
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
        let nextQuestionNumber = this.state.questionNumber += 1;
        this.setState({
          questionNumber: nextQuestionNumber,
          streak: 0,
          answer: (this.state.quiz.questions[nextQuestionNumber].answerPlaceholder || ''),
          status: 'question',
          showAnswers: false,
          renderUnarchiveButton: true
        }, this.setUpMatching.bind(this));
      }
    } else {
      let quizQuestion = this.state.quiz.questions[this.state.questionNumber];
      let answerIsCorrect = this.checkAnswer({
        question: quizQuestion,
        answer: this.state.answer
      });
      if (answerIsCorrect) {
        this.setState({
          status: 'correct'
        }, () => {
          if (quizQuestion.cardId || quizQuestion.wordId) {
            const gotCorrectAfterFailing = !!this.state.wrongAnswerLog[this.state.questionNumber];
            const lastStreakUpdateTimestamp = quizQuestion.lastStreakAdd && (quizQuestion.lastStreakAdd * 1000);
            const beginningOfTodayTimestamp = new Date().setHours(0, 0, 0, 0);
            const streakAlreadyUpdatedToday = quizQuestion.lastStreakAdd && (lastStreakUpdateTimestamp === beginningOfTodayTimestamp);
            if (!gotCorrectAfterFailing && !streakAlreadyUpdatedToday) {
              this.updateStreak.call(this, this.state.status);
            }
          }
        });
      } else {
        let { wrongAnswerLog } = this.state;
        wrongAnswerLog[this.state.questionNumber] = 'wrong';
        this.setState({
          status: 'wrong',
          wrongAnswerLog
        }, () => {
          if (quizQuestion.cardId || quizQuestion.wordId) {
            this.updateStreak.call(this, this.state.status);
          }
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

  clickArchive(e) {
    e.target.classList.add('hidden');
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory: 'card_tags',
      entityName: 'cardTag',
      entity: { tagId: this.props.archivedTagId, cardtagableId: this.state.quiz.questions[this.state.questionNumber].cardId, cardtagableType: 'Card' }
    }).then(() => {
      this.setState({
        fetching: false
      });
    });
  }

  clickUnarchive(e) {
    this.setState({
      renderUnarchiveButton: false,
      fetching: true
    });
    this.props.deleteEntity({
      directory: 'card_tags',
      id: this.state.quiz.questions[this.state.questionNumber].tags.find((tag) => { return tag['name'] === 'Archived' }).id,
      callback: () => {
        this.setState({
          fetching: false
        });
      }
    });
  }

  clickHighlight(e) {
    e.target.classList.add('hidden');
    let question = this.state.quiz.questions[this.state.questionNumber];
    let entityName = question.entity;
    this.setState({
      fetching: true
    });
    this.props.createEntity({
      directory: 'card_tags',
      entityName: 'cardTag',
      entity: { tagId: this.props.needsAttentionTagId, cardtagableId: question.wordId, cardtagableType: ChangeCase.pascalCase(entityName) }
    }).then(() => {
      this.setState({
        fetching: false
      });
    });
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

  checkAnswer(args) {
    const isMatchingQuestion = Object.keys(this.state.matchedItems).length > 0;
    const question = args.question;
    const userAnswer = args.answer;
    if (isMatchingQuestion) {
      return this.objectsAreEqual(this.state.matchedItems, question.matchBins);
    }
    if (question.answers.indexOf(userAnswer) > -1) {
      return true;
    }
    const sortedQuestionAnswer = question.answers[0].split("\n").sort().join("\n");
    const sortedUserAnswer = userAnswer.split("\n").sort().join("\n");
    if (sortedQuestionAnswer === sortedUserAnswer) {
      return true;
    }
    return false;
  }

  render() {
    if (this.state.errors.length > 0) {
      return(
        <div id="quiz-run" className="component">
          { this.renderErrors() }
          <a className="edit-quiz" href={ `/quizzes/${window.location.pathname.split('/')[2]}` }>Edit Quiz</a>
        </div>
      );
    } else {
      return(
        <div id="quiz-run" className="component">
          <h1>{ this.renderHeader() }</h1>
          { this.renderWrongAnswers() }
          <div className="white-box">
            { this.renderStreakNotification() }
            { Common.renderSpinner(this.state.fetching) }
            { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
            <p className="question m-bottom">{ this.renderQuestion() }</p>
            { this.renderDescription() }
            { this.renderImage() }
            <form>
              { this.renderInput() }
              { this.renderAnswers() }
              <input type="submit" className={ this.buttonClass() + " standard-width" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ this.clickCheckAnswer.bind(this) } value={ this.state.status === 'correct' ? 'Next Question' : 'Check Answer' } />
              <a className="gray-outline-button float-button small-padding small-width" onClick={ this.toggleAnswers.bind(this) }>{ this.state.showAnswers ? 'Hide Answers' : 'Show Answers' }</a>
              { this.renderArchiveButton() }
              { this.renderUnarchiveButton() }
              { this.renderHighlightButton() }
            </form>
          </div>
        </div>
      );
    }
  }

  renderErrors() {
    return this.state.errors.map((error, index) => {
      return(
        <p key={ index } className="quiz-run-error">{ error }</p>
      );
    })
  }

  renderDescription() {
    if (this.state.quiz.questions) {
      const question = this.state.quiz.questions[this.state.questionNumber];
      const description = question.description;
      const note = question.note;
      if (description) {
        if (note) {
          return(
            <p className="description">{ ChangeCase.titleCase(description) } - { note }</p>
          );
        } else {
          return(
            <p className="description">{ ChangeCase.titleCase(description) }</p>
          );
        }
      }
    }
  }

  renderArchiveButton() {
    if (!this.state.quiz.questions) {
      return;
    }
    let question = this.state.quiz.questions[this.state.questionNumber];
    if (question.archiveButton && !question.tags.find((tag) => { return tag['name'] === 'Archived' })) {
      return(
        <div className="archive-button" onClick={ this.clickArchive.bind(this) }></div>
      );
    }
  }

  renderUnarchiveButton() {
    if (!this.state.quiz.questions) {
      return;
    }
    let question = this.state.quiz.questions[this.state.questionNumber];
    if (this.state.renderUnarchiveButton && question.unarchiveButton && question.tags.find((tag) => { return tag['name'] === 'Archived' })) {
      return(
        <div className="unarchive-button-container">
          <div className="unarchive-button" onClick={ this.clickUnarchive.bind(this) }></div>
          <div className="archive-button"></div>
        </div>
      );
    }
  }

  renderHighlightButton() {
    if (!this.state.quiz.questions) {
      return;
    }
    let question = this.state.quiz.questions[this.state.questionNumber];
    if (question.highlightButton && question.tags.indexOf('Needs Attention') === -1) {
      return(
        <div className="highlight-button" onClick={ this.clickHighlight.bind(this) }></div>
      );
    }
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

  renderStreakNotification() {
    if (this.state.streak > 0 && this.state.streak <= 5) {
      return (
        <div className="streak-notification">Streak: { this.state.streak }</div>
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
        <input className={ `m-bottom ${this.state.status === 'wrong' ? ' error' : ''}` } onKeyPress={ this.checkKey.bind(this) } onChange={ this.changeAnswer.bind(this) } value={ this.state.answer } />
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
          let spanTags = answer.split("\n").map((line, index) => {
            return(
              <>
                <span key={ index }>{ line }</span><br />
              </>
            );
          })
          return(
            <p className="answer">
              { spanTags }
            </p>
          );
        }
      });
    } else {
      return '';
    }
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createEntity, updateEntity, deleteEntity, runQuiz }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizRun);
