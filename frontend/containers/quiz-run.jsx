import React from 'react'
import { Spinner, GrayedOut, sendRequest, removeFromArray, objectsAreEqual, updateEntity, Button, OutlineButton, deleteEntity, createEntity, titleCase } from 'handy-components'
import { shuffle } from 'lodash';
import { pascalCase, snakeCase } from 'change-case'

const SECONDS_IN_DAY = 86400;

const COLORS = {
  red: '#FF0000',
  redHover: '#B40404',
  green: '#04B404',
  greenHover: '088A08',
  blue: 'blue',
}

function Diagram(props) {
  const { data } = props;
  return (
    <>
      <div className="diagram">
        { data.map(question => {
          return (
            <div className="square"></div>
          );
        })}
      </div>
      <style jsx>{`
        .diagram {
          position: absolute;
          bottom: 0%;
          margin-bottom: 40px;
        }
        .square {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: white;
          margin-right: 10px;
          border-radius: 2px;
          box-shadow: 1px 2px 3px 0px #e6e9ec;
        }
      `}</style>
    </>
  )
}

function Streak(props) {
  const GREEN = '#04B404';
  const BLUE = '#013adf';
  const GRAY = 'gray';
  const RED = 'red';

  const { currentQuestion, streakFrozen, justIncrementedStreak, justResetStreak } = props;

  let color = BLUE;
  if (streakFrozen) {
    color = GRAY;
  }
  if (justIncrementedStreak) {
    color = GREEN;
  }
  if (justResetStreak) {
    color = RED;
  }

  return currentQuestion ? (
    <>
      <div>Streak: { currentQuestion.streak }</div>
      <style jsx>{`
        div {
          display: block;
          padding: 5px 10px;
          position: absolute;
          right: 32px;
          background-color: ${color};
          color: white;
          border-radius: 5px;
          font-family: 'TeachableSans-Bold';
        }
      `}</style>
    </>
  ) : null;
}

export default class QuizRun extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      spinner: true,
      errors: [],
      quiz: {},
      questionNumber: 0,
      currentRotation: [],
      rotationNumber: 1,
      repeatQuestions: [],
      answer: '',
      matchedItems: {},
      unmatchedItems: [],
      status: 'question',
      streak: 0,
      showAnswers: false,
      incorrectQuestionIds: [],
      highlightQuestionIds: [],
      renderUnarchiveButton: true,
      wrongAnswerCount: 0,
      showHighlightButton: true,
      showArchiveButton: true,
      streakSpinner: false,
      justIncrementedStreak: false,
      justResetStreak: false,
    };
  }

  componentDidMount() {
    const id = window.location.pathname.split('/')[2];
    sendRequest(`/api/quizzes/${id}/run`).then((response) => {
      const { quiz, needsAttentionTagId } = response;
      const firstQuestion = quiz.questions[0];
      this.setState({
        needsAttentionTagId,
        spinner: false,
        quiz,
        answer: (firstQuestion && firstQuestion.answerPlaceholder) || '',
        currentRotation: quiz.questions,
      }, this.setUpMatching.bind(this));
    }, (response) => {
      const { errors } = response;
      this.setState({
        errors,
      })
    });
  }

  changeAnswer(e) {
    let answer = e.target.value;
    const currentQuestion = this.currentQuestion();
    if (currentQuestion.screamingSnake) {
      answer = answer.replace(" ", "_").toUpperCase();
    }
    this.setState({
      answer,
      status: 'question',
    });
  }

  checkKey(e) {
    if (e.charCode === 96) {
      if (!this.answerIncludesBacktick()) {
        e.preventDefault();
        this.setState({
          showAnswers: !this.state.showAnswers,
        });
      }
    }
  }

  answerIncludesBacktick() {
    const question = this.state.quiz.questions[this.state.questionNumber];
    let included = false;
    question.answers.forEach((answer) => {
      if (answer.indexOf('`') >= 0) {
        included = true;
      }
    })
    return included;
  }

  updateStreak(status) {

    const incrementStreak = status === 'correct';
    const resetStreak = !incrementStreak;

    // determine what type of record needs its streak info updated
    const currentQuestion = this.currentQuestion();
    const entityName = currentQuestion.cardId ? 'card' : currentQuestion.entity;

    // determine the new streak info
    let entity = {};
    entity.streak = (incrementStreak ? (+currentQuestion.streak + 1) : 0);
    const currentUnixTimestamp = (new Date().setHours(0, 0, 0, 0) / 1000);
    entity.streakFreezeExpiration = currentUnixTimestamp + SECONDS_IN_DAY;

    let newState = {};
    if (incrementStreak) {
      newState.justIncrementedStreak = true;
    } else {
      newState.justResetStreak = true;
    }

    // update streak and streak freeze expiration for all relevant questions
    let currentRotation = this.state.currentRotation;
    currentRotation.forEach(question => {
      if ((question.wordId && question.wordId === currentQuestion.wordId && question.entity === currentQuestion.entity) || (question.cardId && question.cardId === currentQuestion.cardId)) {
        question.streak = entity.streak;
        question.streakFreezeExpiration = entity.streakFreezeExpiration;
      }
    })
    newState.currentRotation = currentRotation;
    this.setState(newState);

    // update the database
    updateEntity({
      directory: currentQuestion.cardId ? 'cards' : `${snakeCase(currentQuestion.entity)}s`,
      id: currentQuestion.cardId ? currentQuestion.cardId : currentQuestion.wordId,
      entityName,
      entity,
    });
  }

  clickCheckAnswer(streakFrozen) {
    const { matchedItems, quiz, status, questionNumber, answer, incorrectQuestionIds, repeatQuestions, rotationNumber, currentRotation } = this.state;
    let matchingQuestion = Object.keys(matchedItems).length > 0;
    if (!matchingQuestion && answer === '') {
      return;
    }
    if (status === 'correct') { // proceed to next question
      const finishedAllQuestions = (questionNumber + 1) === currentRotation.length;
      if (finishedAllQuestions) {
        if (repeatQuestions.length > 0) {
          this.setState({
            quiz,
            showHighlightButton: true,
            showArchiveButton: true,
            questionNumber: 0,
            streak: 0,
            answer: (repeatQuestions[0].answerPlaceholder || ''),
            status: 'question',
            showAnswers: false,
            renderUnarchiveButton: true,
            currentRotation: repeatQuestions,
            rotationNumber: rotationNumber + 1,
            repeatQuestions: [],
            wrongAnswerCount: 0,
            justIncrementedStreak: false,
            justResetStreak: false,
          }, this.setUpMatching.bind(this));
        } else {
          const totalIncorrectAnswers = incorrectQuestionIds.length;
          if (totalIncorrectAnswers > 0) {
            let total = quiz.questions.length;
            let correct = total - totalIncorrectAnswers;
            let percentage = Math.floor((correct / total) * 100);
            let firstLine = `${totalIncorrectAnswers} wrong answers - ${percentage}% correct`;
            let messageLines = [firstLine];
            incorrectQuestionIds.forEach((id) => {
              messageLines.push(quiz.questions.find(question => question.id === id).question);
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
            localStorage.setItem('message', 'No incorrect answers.');
            localStorage.setItem('message-color', 'green');
          }
          window.location.pathname = '/quizzes';
        }
      } else {
        let nextQuestionNumber = questionNumber + 1;
        this.setState({
          showHighlightButton: true,
          showArchiveButton: true,
          questionNumber: nextQuestionNumber,
          streak: 0,
          answer: (currentRotation[nextQuestionNumber].answerPlaceholder || ''),
          status: 'question',
          showAnswers: false,
          renderUnarchiveButton: true,
          justIncrementedStreak: false,
          justResetStreak: false,
        }, this.setUpMatching.bind(this));
      }
    } else {
      let quizQuestion = currentRotation[questionNumber];
      let answerStatus = this.checkAnswer({
        question: quizQuestion,
        answer,
      });
      if (answerStatus === 'correct') {
        this.setState({
          status: 'correct',
        }, () => {
          if (quizQuestion.cardId || quizQuestion.wordId) {
            const gotCorrectAfterFailing = incorrectQuestionIds.includes(quizQuestion.id);
            if (!gotCorrectAfterFailing && !streakFrozen) {
              const { status } = this.state;
              this.updateStreak.call(this, status);
            }
          }
        });
      } else if (answerStatus === 'indeterminate') {
        this.setState({
          status: 'indeterminate',
        });
      } else {
        let { incorrectQuestionIds, repeatQuestions, wrongAnswerCount } = this.state;
        if (!quizQuestion.noRepeat && !repeatQuestions.map(question => question.id).includes(quizQuestion.id)) {
          repeatQuestions.push(quizQuestion);
          wrongAnswerCount += 1;
        }
        incorrectQuestionIds.push(quizQuestion.id);
        incorrectQuestionIds = [...new Set(incorrectQuestionIds)];
        this.setState({
          status: 'wrong',
          incorrectQuestionIds,
          repeatQuestions,
          wrongAnswerCount,
        }, () => {
          if (quizQuestion.cardId || quizQuestion.wordId) {
            this.updateStreak.call(this, status);
          }
        });
      }
    }
  }

  objectsAreEqual(obj1, obj2) {
    let result = 'correct';
    Object.keys(obj1).forEach((binName) => {
      let items1 = obj1[binName].sort();
      let items2 = obj2[binName].sort();
      if (JSON.stringify(items1) !== JSON.stringify(items2)) {
        result = 'incorrect';
      }
    })
    return result;
  }

  clickArchive() {
    const { quiz, questionNumber } = this.state;
    let question = quiz.questions[questionNumber];
    this.setState({
      spinner: true,
      showArchiveButton: true,
    });
    createEntity({
      directory: 'card_tags',
      entityName: 'cardTag',
      entity: {
        tagId: this.props.archivedTagId,
        cardtagableId: question.cardId,
        cardtagableType: 'Card',
      },
    }).then(() => {
      this.setState({
        spinner: false,
      });
    });
  }

  clickUnarchive(currentQuestion) {
    const { highlightQuestionIds } = this.state;
    this.setState({
      renderUnarchiveButton: false,
      spinner: true,
    });
    deleteEntity({
      directory: 'card_tags',
      id: currentQuestion.tags.find((tag) => { return tag['name'] === 'Archived' }).id,
    }).then(() => {
      this.setState({
        spinner: false,
        highlightQuestionIds: [...new Set(highlightQuestionIds + [currentQuestion.id])],
      });
    });
  }

  clickHighlight() {
    const { needsAttentionTagId, highlightQuestionIds } = this.state;
    const currentQuestion = this.currentQuestion();
    const { wordId, entity: entityName } = currentQuestion;
    this.setState({
      spinner: true,
      showHighlightButton: false,
    });
    createEntity({
      directory: 'card_tags',
      entityName: 'cardTag',
      entity: {
        tagId: needsAttentionTagId,
        cardtagableId: wordId,
        cardtagableType: pascalCase(entityName),
      }
    }).then(() => {
      this.setState({
        spinner: false,
        highlightQuestionIds: [...new Set(highlightQuestionIds + [currentQuestion.id])],
      });
    });
  }

  setUpMatching() {
    const currentQuestion = this.currentQuestion();
    if (!currentQuestion) {
      return;
    }
    if (currentQuestion.matchBins) {
      let matchBinNames = Object.keys(currentQuestion.matchBinsShuffled);
      let matchedItems = {};
      let unmatchedItems = [];
      matchBinNames.forEach((binName) => {
        matchedItems[binName] = [];
        unmatchedItems = unmatchedItems.concat(currentQuestion.matchBinsShuffled[binName]);
      })
      this.setState({
        matchedItems,
        unmatchedItems: shuffle(unmatchedItems),
      }, this.setUpDragAndDrop.bind(this));
    } else {
      this.setState({
        matchedItems: {},
        unmatchedItems: [],
      })
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
    unmatchedItems = removeFromArray(unmatchedItems, itemName);
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
    removeFromArray(matchedItems[binName], itemName);
    unmatchedItems.push(itemName);
    this.setState({
      status: 'question',
      unmatchedItems,
      matchedItems
    }, this.setUpDragAndDrop.bind(this));
  }

  checkAnswer(args) {
    const { answer: userAnswer, question } = args;
    const correctAnswerCharacters = question.answers[0].split('');

    const isMatchingQuestion = Object.keys(this.state.matchedItems).length > 0;
    const isChemicalEquation = userAnswer.indexOf('→') > -1;
    const isRegEx = correctAnswerCharacters[0] === '/' && correctAnswerCharacters[correctAnswerCharacters.length - 1] === '/';

    if (isMatchingQuestion) {
      return this.objectsAreEqual(this.state.matchedItems, question.matchBins);
    }
    if (isChemicalEquation) {
      const userAnswerSides = userAnswer.split('→');
      const userAnswerLeft = userAnswerSides[0].split(' ').filter((element) => ['', '+'].indexOf(element) === -1);
      const userAnswerRight = userAnswerSides[1].split(' ').filter((element) => ['', '+'].indexOf(element) === -1);
      const correctAnswerSides = question.answers[0].split('→');
      const correctAnswerLeft = correctAnswerSides[0].split(' ').filter((element) => ['', '+'].indexOf(element) === -1);
      const correctAnswerRight = correctAnswerSides[1].split(' ').filter((element) => ['', '+'].indexOf(element) === -1);
      if (objectsAreEqual(userAnswerLeft.sort(), correctAnswerLeft.sort()) && objectsAreEqual(userAnswerRight.sort(), correctAnswerRight.sort())) {
        return 'correct'
      } else {
        return 'incorrect'
      }
    }
    if (isRegEx) {
      const regexString = question.answers[0];
      const regex = new RegExp(regexString.slice(1, -1));
      const matchData = userAnswer.match(regex);
      if (matchData && matchData[0] === userAnswer) {
        return 'correct';
      }
    }
    if (question.answers.indexOf(userAnswer) > -1) {
      return 'correct';
    }
    if (question.indeterminate && question.indeterminate.indexOf(userAnswer) > -1) {
      return 'indeterminate';
    }
    const sortedQuestionAnswer = question.answers[0].split("\n").sort().join("\n");
    const sortedUserAnswer = userAnswer.split("\n").sort().join("\n");
    if (sortedQuestionAnswer === sortedUserAnswer) {
      return 'correct';
    }
    return 'incorrect';
  }

  currentQuestion() {
    const { currentRotation, questionNumber } = this.state;
    return currentRotation ? currentRotation[questionNumber] : null;
  }

  generateDiagramData() {
    const { currentRotation } = this.state;
    let result = [];
    currentRotation.forEach(question => {
      result.push({ id: question.id });
    })
    return result;
  }

  render() {
    const {
      errors,
      spinner,
      showAnswers,
      showArchiveButton,
      showHighlightButton,
      status,
      quiz,
      questionNumber,
      wrongAnswerCount,
      currentRotation,
      highlightQuestionIds,
      justIncrementedStreak,
      justResetStreak,
    } = this.state;

    let buttonColor;
    let buttonHoverColor;
    switch(status) {
      case 'correct':
        buttonColor = COLORS.green;
        buttonHoverColor = COLORS.greenHover;
        break;
      case 'wrong':
        buttonColor = COLORS.red;
        buttonHoverColor = COLORS.redHover;
    }

    const statusCorrect = status === 'correct';
    const currentQuestion = this.currentQuestion();
    const showStreakNotification = justIncrementedStreak || justResetStreak;

    let descriptionText;
    if (currentQuestion) {
      const { description, hint, note } = currentQuestion
      descriptionText = titleCase(description || hint || "");
      if (note) {
        descriptionText = descriptionText + ` - ${ note }`;
      }
    }

    const renderArchiveButton = currentQuestion && showArchiveButton && currentQuestion.archiveButton && !currentQuestion.tags.find((tag) => { return tag['name'] === 'Archived' });
    const renderUnarchiveButton = currentQuestion && this.state.renderUnarchiveButton && currentQuestion.unarchiveButton && currentQuestion.tags.find((tag) => { return tag['name'] === 'Archived' }) && !highlightQuestionIds.includes(currentQuestion.id.toString());
    const renderHighlightButton = currentQuestion && showHighlightButton && currentQuestion.highlightButton && currentQuestion.tags.indexOf('Needs Attention') === -1 && !highlightQuestionIds.includes(currentQuestion.id.toString());

    const streakFrozen = (currentQuestion && currentQuestion.streakFreezeExpiration) > (Date.now() / 1000);

    if (errors.length > 0) {
      return (
        <>
          <div className="handy-component">
            { errors.map((error, index) => <p key={ index } className="quiz-run-error">{ error }</p>) }
            <a className="edit-quiz" href={ `/quizzes/${window.location.pathname.split('/')[2]}` }>Edit Quiz</a>
          </div>
          <style jsx>{`
            .quiz-run-error {
              padding: 10px;
              background-color: #fbe2e2;
              color: #c74a47;
              font-size: 14px;
              font-family: 'TeachableSans-SemiBold';
              margin-bottom: 20px;
            }

            a.edit-quiz {
              text-decoration: underline;
            }
          `}</style>
        </>
      );
    } else {
      const imageUrl = (currentQuestion && currentQuestion.imageUrl) || null;
      return (
        <>
          <Diagram
            data={ this.generateDiagramData() }
          />
          <div className="handy-component">
            <h1>{ quiz && quiz.name && `${quiz.name} - ${questionNumber + 1}/${currentRotation.length}` }</h1>
            { !!wrongAnswerCount && <p className="wrong-count">Wrong: { wrongAnswerCount }</p> }
            <div className="white-box">
              { showStreakNotification && <Streak
                currentQuestion={ currentQuestion }
                streakFrozen={ streakFrozen }
                justIncrementedStreak={ justIncrementedStreak }
                justResetStreak={ justResetStreak }
              /> }
              <p className="question">{ currentQuestion && currentQuestion.question }</p>
              { descriptionText && <p className="description">{ descriptionText }</p> }
              { imageUrl && <img src={ imageUrl } /> }
              <form>
                <div className="input-container">
                  { this.renderInput(currentQuestion) }
                </div>
                { this.renderAnswers(currentQuestion) }
                <Button
                  submit
                  disabled={ spinner }
                  text={ statusCorrect ? "Next Question" : "Check Answer" }
                  onClick={ () => { this.clickCheckAnswer(streakFrozen) } }
                  color={ buttonColor }
                  hoverColor={ buttonHoverColor }
                />
                <OutlineButton
                  text={ showAnswers ? 'Hide Answers' : 'Show Answers' }
                  onClick={ () => { this.setState({ showAnswers: !showAnswers }); } }
                  color='#5F5F5F'
                  float
                />
                { renderArchiveButton && (
                  <div
                    className="archive-button"
                    onClick={ () => { this.clickArchive() } }
                  />
                ) }
                { renderUnarchiveButton && (
                  <div className="unarchive-button-container">
                    <div className="unarchive-button" onClick={ () => this.clickUnarchive(currentQuestion) }></div>
                    <div className="archive-button"></div>
                  </div>
                ) }
                { renderHighlightButton && (
                  <div
                    className="highlight-button"
                    onClick={ () => { this.clickHighlight() } }
                  />
                ) }
              </form>
              <Spinner visible={ spinner } />
              <GrayedOut visible={ spinner } />
            </div>
            { currentQuestion && currentQuestion.editLink && <a className="card-link" href={ currentQuestion.editLink } target="_blank">{ currentQuestion.editLinkText }</a> }
          </div>
          <style jsx>{`
            a.card-link {
              margin-top: 10px;
              display: inline-block;
              position: absolute;
              right: 40px;
              color: gray;
            }
            p.question {
              font-family: 'TeachableSans-ExtraBold';
              font-size: 30px;
              line-height: 42px;
              color: black;
              margin-bottom: 30px;
            }
            p.description {
              margin-top: -20px;
              margin-bottom: 20px;
            }
            p.wrong-count {
              margin-top: 10px;
              display: inline-block;
              float: right;
              color: red;
            }
            img {
              height: 200px;
              margin-bottom: 30px;
            }
            .input-container {
              margin-bottom: 30px;
            }
            div.archive-button {
              margin-top: 2px;
              float: right;
              margin-right: 20px;
              width: 25px;
              height: 25px;
              cursor: pointer;
            }
            div.unarchive-button-container {
              float: right;
              position: relative;
            }
            div.unarchive-button {
              position: absolute;
              background-size: 100%;
              width: 50px;
              height: 50px;
              left: -12px;
              top: -10px;
              cursor: pointer;
            }
            div.highlight-button {
              margin-top: 2px;
              float: right;
              margin-right: 20px;
              width: 25px;
              height: 25px;
              background-size: contain;
              cursor: pointer;
            }
            .grabbing {
              cursor: grabbing !important;
              cursor: -webkit-grabbing !important;
              cursor: -moz-grabbing !important;
            }
          `}</style>
        </>
      );
    }
  }

  renderInput(currentQuestion) {
    const { answer, unmatchedItems, status } = this.state;
    if (currentQuestion && currentQuestion.matchBins && Object.keys(currentQuestion.matchBins).length > 0) {
      return (
        <>
          <ul key="1" className="bins-container">
            { Object.keys(currentQuestion.matchBinsShuffled).map((binName, index) => {
              return(
                <li key={ index } className="bin" data-name={ binName }>
                  { binName }
                  { this.renderMatchedItems(binName) }
                </li>
              );
            }) }
          </ul>
          <ul key="2" className="unmatched-items-container">
            { unmatchedItems.map((itemName, index) => {
              return (
                <li key={ index } className="unmatched-item" onMouseDown={ this.mouseDownHandler } onMouseUp={ this.mouseUpHandler } data-name={ itemName } >
                  { itemName }
                </li>
              );
            }) }
          </ul>
          <style jsx>{`
            .bins-container {
              margin-bottom: 30px;
            }
            .bin {
              display: inline-block;
              border: solid 1px gray;
              border-radius: 3px;
              padding: 20px 30px;
              font-size: 14px;
              user-select: none;
              vertical-align: top;
              text-align: center;
              margin-bottom: 15px;
            }
            .bin.selected {
              background-color: #CEECF5;
            }
            .bin:not(:last-of-type) {
              margin-right: 30px;
            }
            .unmatched-item {
              display: inline-block;
              border: solid 1px gray;
              border-radius: 3px;
              padding: 8px 10px;
              cursor: grab;
              user-select: none;
            }
            .unmatched-item.selected {
              background-color: #CEECF5;
            }
            .unmatched-item:not(:last-of-type) {
              margin-right: 10px;
              margin-bottom: 10px;
            }
          `}</style>
        </>
      );
    } else if (currentQuestion && currentQuestion.choices) {
      return (
        <div>
          { currentQuestion.choices.sort().map((choice, index) => {
            return (
              <React.Fragment key={ index }>
                <div className="choice-container">
                  <input id={ `option-${index}` } onChange={ this.selectOption.bind(this) } checked={ answer === choice } type="radio" name="choice" value={ choice } />
                  <label htmlFor={`option-${index}`}>{ choice }</label>
                </div>
                <style jsx>{`
                  div:not(:last-of-type) {
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
              </React.Fragment>
            );
          })}
        </div>
      );
    } else if (currentQuestion && currentQuestion.textbox) {
      const lineCount = answer.split("\n").length;
      return (
        <>
          <textarea
            rows="6"
            columns="12"
            className={ status === 'wrong' ? 'error' : null }
            onChange={ this.changeAnswer.bind(this) } value={ answer }
            style={ currentQuestion.inconsolata ? {
              fontSize: 16,
              fontFamily: 'Inconsolata',
            } : {} }
          />
          { currentQuestion.lineCount && (
            <p>Line Count: { lineCount }</p>
          ) }
          <style jsx>{`
            p {
              margin-top: 5px;
            }
          `}</style>
        </>
      );
    } else {
      let style = {
        border: status === 'indeterminate' ? `solid 1px ${COLORS.blue}` : null,
      }
      if (currentQuestion && currentQuestion.inconsolata) {
        style = {
          ...style,
          fontSize: 16,
          fontFamily: 'Inconsolata',
        }
      }
      return (
        <input
          style={ style }
          className={ status === 'wrong' ? 'error' : null }
          onKeyPress={ this.checkKey.bind(this) }
          onChange={ this.changeAnswer.bind(this) }
          value={ answer || "" }
        />
      );
    }
  }

  renderMatchedItems(binName) {
    let matchedItems = this.state.matchedItems[binName];
    if (matchedItems && matchedItems.length > 0) {
      return (
        <>
          <ul className="bin-items-container">
            { matchedItems.map((itemName) => {
              return (
                <li key={ itemName } className="bin-item" onClick={ this.removeMatchItem.bind(this) }>{ itemName }</li>
              );
            }) }
          </ul>
          <style jsx>{`
            .bin-item {
              margin-top: 10px;
              border: solid 1px gray;
              border-radius: 3px;
              padding: 8px 10px;
              font-size: 12px;
              text-align: center;
              cursor: pointer;
            }
          `}</style>
        </>
      );
    }
  }

  renderAnswers(currentQuestion) {
    const { showAnswers } = this.state;
    if (currentQuestion && showAnswers) {
      const { answers, matchBins } = currentQuestion;
      if (matchBins && matchBins.length > 0) {
        const answer = answers[0];
        return (
          <>
            <div className="answers-container">
              <pre>{ answer }</pre>
            </div>
            <style jsx>{`
              .answers-container {
                margin-top: -15px;
                margin-bottom: 15px;
              }
            `}</style>
          </>
        );
      } else {
        let answers = [];
        currentQuestion.answers.forEach((answer) => {
          if (/\n/.test(answer)) {
            answers = answers.concat(answer.split("\n"));
          } else {
            answers.push(answer)
          }
        });
        return (
          <>
            <div className="answers-container">
              { answers.map((answer, index) => {
                return (
                  <p key={ index } className="answer">{ answer }</p>
                );
              }) }
            </div>
            <style jsx>{`
              .answers-container {
                margin-top: -15px;
                margin-bottom: 15px;
              }
              .answer {
                font-size: 14px;
              }
              .answer:not(:last-of-type) {
                margin-bottom: 5px;
              }
            `}</style>
          </>
        );
      }
    }
  }
}
