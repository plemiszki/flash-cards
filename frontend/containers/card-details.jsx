import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import HandyTools from 'handy-tools'
import { Common, Details, ModalSelectStyles } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'
import NewEntity from './new-entity.jsx'

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
      matchBins: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    this.props.fetchEntity({
      id: window.location.pathname.split('/')[2],
      directory: window.location.pathname.split('/')[1],
      entityName: this.props.entityName
    }, 'card').then(() => {
      this.setState({
        fetching: false,
        card: this.props.card,
        cardSaved: HandyTools.deepCopy(this.props.card),
        cardTags: this.props.cardTags,
        tags: this.props.tags,
        matchBins: this.props.matchBins,
        changesToSave: false
      }, () => {
        HandyTools.setUpNiceSelect({ selector: 'select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
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
    }, () => {
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
      fetching: false,
      cardTags: response.entities || response.cardTags
    });
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
        entity: {
          tagId: e.target.dataset.id,
          cardtagableId: this.state.card.id,
          cardtagableType: 'Card'
        }
      }).then(this.updateCardTags.bind(this));
    });
  }

  clickUploadImage() {
    const client = filestack.init(document.getElementById('filestack-api-key').innerHTML);
    const options = {
      onUploadDone: (response) => {
        let url = response.filesUploaded[0].url;
        let card = this.state.card;
        card.imageUrl = url;
        this.setState({
          card
        }, () => {
          this.setState({
            changesToSave: this.checkForChanges()
          });
        });
      },
      fromSources: ['local_file_system']
    };
    client.picker(options).open();
  }

  updateMatchBins(response) {
    this.setState({
      newMatchBinModalOpen: false,
      newMatchItemModalOpen: false,
      matchBins: response
    });
  }

  clickPlus(binId, e) {
    this.setState({
      newMatchItemModalOpen: true,
      selectedMatchBinId: binId
    });
  }

  delete(type, e) {
    let id = e.target.dataset.id;
    this.setState({
      fetching: true
    });
    if (type === 'bin') {
      this.props.deleteEntity({
        directory: 'match_bins',
        id,
        callback: (response) => {
          this.setState({
            fetching: false,
            matchBins: response.matchBins
          });
        }
      });
    } else {
      this.props.deleteEntity({
        directory: 'match_items',
        id,
        callback: (response) => {
          this.setState({
            fetching: false,
            matchBins: response.matchBins
          });
        }
      });
    }
  }

  renderMatchTable() {
    let result = [];
    HandyTools.alphabetizeArrayOfObjects(this.state.matchBins, 'name').forEach((matchBin) => {
      result.push({
        text: matchBin.name,
        type: 'bin',
        id: matchBin.id
      });
      matchBin.matchItems.forEach((matchItem) => {
        result.push({
          text: matchItem.name,
          type: 'item',
          id: matchItem.id
        })
      })
    })
    return result.map((obj, index) => {
      return(
        <tr key={ index } className={ `${obj.type}-row` }>
          <td>{ obj.text }</td>
          { this.renderPlus(obj) }
          <td className="x-column" onClick={ this.delete.bind(this, obj.type) } data-id={ obj.id }></td>
        </tr>
      );
    })
  }

  renderPlus(obj) {
    if (obj.type === 'bin') {
      return(
        <td className="x-column plus-column" onClick={ this.clickPlus.bind(this, obj.id) } data-id={ obj.id }></td>
      );
    } else {
      return(
        <td></td>
      );
    }
  }

  render() {
    return(
      <div id="card-details" className="component details-component">
        <h1>Card Details</h1>
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'card', property: 'question' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 9, entity: 'card', property: 'imageUrl', uploadLinkFunction: this.clickUploadImage.bind(this) }) }
            <div className="col-xs-3">
              <img src={ this.state.card.imageUrl } />
            </div>
          </div>
          <div className="row">
            { Details.renderTextBox.bind(this)({ rows: 5, columnWidth: 10, entity: 'card', property: 'answer' }) }
            { Details.renderCheckbox.bind(this)({ columnWidth: 2, entity: 'card', property: 'multipleChoice' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width m-bottom" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this, { callback: null }) }>
              Delete
            </a>
          </div>
          <hr className="divider" />
          <table className="admin-table no-links no-hover no-padding m-bottom">
            <thead>
              <tr>
                <th>Match Bins</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              { this.renderMatchTable() }
            </tbody>
          </table>
          <a className="gray-outline-button small-width small-padding m-bottom" onClick={ Common.changeState.bind(this, 'newMatchBinModalOpen', true) }>Add Bin</a>
          <hr className="divider" />
          { EntityTags.renderTags.call(this, 'card') }
          <Modal isOpen={ this.state.newMatchBinModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 500 }, 1) }>
            <NewEntity
              entityName="matchBin"
              initialEntity={ { cardId: this.state.card.id, name: '' } }
              callback={ this.updateMatchBins.bind(this) }
            />
          </Modal>
          <Modal isOpen={ this.state.newMatchItemModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 500 }, 1) }>
            <NewEntity
              entityName="matchItem"
              initialEntity={ { matchBinId: this.state.selectedMatchBinId, name: '' } }
              callback={ this.updateMatchBins.bind(this) }
              responseKey="matchBins"
            />
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, createEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
