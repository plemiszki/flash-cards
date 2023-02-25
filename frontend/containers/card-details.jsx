import React from 'react'
import Modal from 'react-modal'
import { setUpNiceSelect, Common, Details, Spinner, GrayedOut, fetchEntity, updateEntity, BottomButtons, objectsAreEqual, deepCopy } from 'handy-components'
import NewEntity from './new-entity.jsx'
import TagsSection from './tags-section';

export default class CardDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyCard = {
      question: '',
      answer: ''
    };

    this.state = {
      spinner: true,
      card: emptyCard,
      cardSaved: emptyCard,
      cardTags: [],
      errors: [],
      matchBins: [],
      newCardTagModalOpen: false
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { card, cardTags, tags, matchBins } = response;
      this.setState({
        spinner: false,
        card,
        cardSaved: deepCopy(card),
        cardTags,
        tags,
        matchBins,
        changesToSave: false
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeField.bind(this, this.changeFieldArgs()) });
      });
    });
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.card, this.state.cardSaved);
  }

  clickSave() {
    const { card } = this.state;
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'card',
        entity: this.state.card
      }).then((response) => {
        const { card } = response;
        this.setState({
          spinner: false,
          card,
          cardSaved: deepCopy(card),
          changesToSave: false,
        });
      }, (response) => {
        const { errors } = response;
        this.setState({
          spinner: false,
          errors,
        });
      });
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
    const { spinner, card, cardTags, tags, justSaved, changesToSave, newMatchBinModalOpen, newMatchItemModalOpen, selectedMatchBinId } = this.state;
    return (
      <>
        <div className="handy-component">
          <h1>Card Details</h1>
          <div className="white-box">
            <div className="row">
              { Details.renderField.bind(this)({ columnWidth: 6, entity: 'card', property: 'question' }) }
              { Details.renderField.bind(this)({ columnWidth: 6, entity: 'card', property: 'hint' }) }
            </div>
            <div className="row">
              { Details.renderField.bind(this)({ columnWidth: 9, entity: 'card', property: 'imageUrl', uploadLinkFunction: this.clickUploadImage.bind(this) }) }
              <div className="col-xs-3">
                <img src={ card.imageUrl } />
              </div>
            </div>
            <div className="row">
              { Details.renderField.bind(this)({ type: 'textbox', rows: 5, columnWidth: 5, entity: 'card', property: 'answer' }) }
              { Details.renderField.bind(this)({ type: 'textbox', rows: 5, columnWidth: 5, entity: 'card', property: 'answerPlaceholder' }) }
              { Details.renderSwitch.bind(this)({ columnWidth: 2, entity: 'card', property: 'multipleChoice' }) }
            </div>
            <BottomButtons
              entityName="card"
              confirmDelete={ Details.confirmDelete.bind(this) }
              justSaved={ justSaved }
              changesToSave={ changesToSave }
              disabled={ spinner }
              clickSave={ () => { this.clickSave() } }
              marginBottom
            />
            <hr />
            <TagsSection
              entity={ card }
              entityName="Card"
              entityTags={ cardTags }
              tags={ tags }
              setSpinner={ bool => this.setState({ spinner: bool }) }
              setTags={ (entityTags, tags) => this.setState({ cardTags: entityTags, tags }) }
            />
            <Modal isOpen={ newMatchBinModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 500 }, 1) }>
              <NewEntity
                entityName="matchBin"
                initialEntity={ { cardId: card.id, name: '' } }
                callback={ this.updateMatchBins.bind(this) }
              />
            </Modal>
            <Modal isOpen={ newMatchItemModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles({ width: 500 }, 1) }>
              <NewEntity
                entityName="matchItem"
                initialEntity={ { matchBinId: selectedMatchBinId, name: '' } }
                callback={ this.updateMatchBins.bind(this) }
                responseKey="matchBins"
              />
            </Modal>
            <Spinner visible={ spinner } />
            <GrayedOut visible={ spinner } />
          </div>
        </div>
        <style jsx>{`
          img {
            margin-bottom: 30px;
          }
        `}</style>
      </>
    );
  }
}

{/* <hr />
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
<a className="gray-outline-button small-width small-padding m-bottom" onClick={ Common.changeState.bind(this, 'newMatchBinModalOpen', true) }>Add Bin</a> */}
