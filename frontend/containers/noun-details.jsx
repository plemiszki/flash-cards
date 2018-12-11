import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';
import ModalSelect from './modal-select.jsx';
import Common from './modules/common.js';

class NounDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyNoun = {
      english: '',
      englishSaved: '',
      foreign: '',
      foreignSaved: '',
      transliterated: '',
      transliteratedSaved: ''
    };

    this.state = {
      fetching: true,
      noun: emptyNoun,
      nounSaved: emptyNoun,
      errors: [],
      nounTags: [],
      tags: [],
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
        noun: this.props.noun,
        nounSaved: HandyTools.deepCopy(this.props.noun),
        tags: this.props.tags,
        nounTags: this.props.nounTags,
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
    return !HandyTools.objectsAreEqual(this.state.noun, this.state.nounSaved);
  }

  clickSave() {
    this.setState({
      fetching: true,
      justSaved: true
    }, function() {
      this.props.updateEntity({
        id: window.location.pathname.split('/')[2],
        directory: window.location.pathname.split('/')[1],
        entity: this.state.noun,
        entityName: 'noun'
      }).then(() => {
        this.setState({
          fetching: false,
          noun: this.props.noun,
          nounSaved: HandyTools.deepCopy(this.props.noun),
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

  updateNounTags(response) {
    this.setState({
      fetching: false,
      nounTags: response.entities
    });
  }

  deleteNounTag(e) {
    let id = e.target.dataset.id;
    this.props.deleteEntity('card_tags', id, this.updateNounTags.bind(this));
  }

  clickTag(e) {
    e.persist();
    this.setState({
      newCardTagModalOpen: false,
      fetching: true
    }, () => {
      this.props.createEntity({
        directory: 'card_tags',
        entityName: 'cardTag',
        entity: { tagId: e.target.dataset.id, cardId: this.state.noun.id, cardType: 'Noun' }
      }).then(this.updateNounTags.bind(this));
    });
  }

  render() {
    return (
      <div id="noun-details" className="component details-component">
        <h1>Noun Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'englishPlural' }) }
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.gender } data-entity="noun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { HandyTools.renderFieldError([], []) }
            </div>
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'foreign', columnHeader: 'Hindi' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'foreignPlural', columnHeader: 'Hindi Plural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'transliteratedPlural' }) }
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
              { HandyTools.alphabetizeArrayOfObjects(this.state.nounTags, 'tagName').map((nounTag, index) => {
                return(
                  <tr key={ index }>
                    <td>{ nounTag.tagName }</td>
                    <td className="x-column" onClick={ this.deleteNounTag.bind(this) } data-id={ nounTag.id }></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding" onClick={ HandyTools.changeState.bind(this, 'newCardTagModalOpen', true) }>Add New</a>
        </div>
        <Modal isOpen={ this.state.newCardTagModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ HandyTools.modalSelectStyles() }>
          <ModalSelect options={ this.state.tags } property={ 'name' } func={ this.clickTag.bind(this) } />
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
    noun: reducers.standardReducer.entity,
    nounTags: reducers.standardReducer.array1,
    tags: reducers.standardReducer.array2,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, createEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NounDetails);
