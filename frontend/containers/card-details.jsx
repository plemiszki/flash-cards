import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, updateEntity, deleteEntity } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';
import NewEntity from './new-entity.jsx';
import Common from './modules/common.js';

class CardDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyCard = {
      question: '',
      answer: ''
    };

    this.state = {
      fetching: true,
      card: emptyCard,
      cardSaved: emptyCard,
      cardTags: [],
      errors: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split("/")[2],
      directory: window.location.pathname.split("/")[1],
      entityName: this.props.entityName
    }).then(() => {
      this.setState({
        fetching: false,
        card: this.props.card,
        cardSaved: HandyTools.deepCopy(this.props.card),
        cardTags: this.props.cardTags,
        tags: this.props.tags,
        changesToSave: false
      }, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !HandyTools.objectsAreEqual(this.state.card, this.state.cardSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entityName: 'card',
        entity: this.state.card
      }).then(() => {
        this.setState({
          fetching: false,
          card: this.props.card,
          cardSaved: HandyTools.deepCopy(this.props.card),
          changesToSave: false
        });
      }, () => {
        this.setState({
          fetching: false,
          errors: this.props.errors
        });
      });
    });
  }

  updateCardTags(response) {
    this.setState({
      newCardTagModalOpen: false,
      cardTags: response.entities || response
    });
  }

  deleteCardTag(e) {
    let id = e.target.dataset.id;
    this.props.deleteEntity('card_tags', id, this.updateCardTags.bind(this));
  }

  render() {
    return (
      <div id="card-details" className="component details-component">
        <h1>Card Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'card', property: 'question' }) }
          </div>
          <div className="row">
            { Details.renderTextBox.bind(this)({ rows: 5, columnWidth: 12, entity: 'card', property: 'answer' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width m-bottom" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
          <hr className="divider" />
          <table className="admin-table no-links m-bottom">
            <thead>
              <tr>
                <th>Tag</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
              </tr>
              { HandyTools.alphabetizeArrayOfObjects(this.state.cardTags, 'tagName').map((cardTag, index) => {
                return(
                  <tr key={ index }>
                    <td>{ cardTag.tagName }</td>
                    <td className="x-column" onClick={ this.deleteCardTag.bind(this) } data-id={ cardTag.id }></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding" onClick={ HandyTools.changeState.bind(this, 'newCardTagModalOpen', true) }>Add New</a>
        </div>
        <Modal isOpen={ this.state.newCardTagModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 500 }, 1) }>
          <NewEntity
            entityName="cardTag"
            entityNamePlural="cardTags"
            initialEntity={ { cardId: this.state.card.id, tagId: Common.firstElementPropertyOrBlank(this.state.tags, 'id') } }
            callback={ this.updateCardTags.bind(this) }
            buttonText="Add Tag"
            array1={ this.state.tags }
          />
        </Modal>
      </div>
    );
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return {
    card: reducers.standardReducer.entity,
    cardTags: reducers.standardReducer.array1,
    tags: reducers.standardReducer.array2,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);