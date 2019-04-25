import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HandyTools from 'handy-tools'
import { Common, Details } from 'handy-components'
import { fetchEntity, createEntity, updateEntity, deleteEntity } from '../actions/index'
import EntityTags from './modules/entity-tags.jsx'

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

  deleteCardTag(e) {
    let id = e.target.dataset.id;
    this.props.deleteEntity('card_tags', id, this.updateCardTags.bind(this));
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
      }, 'cardTags').then(this.updateCardTags.bind(this));
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
            { Details.renderTextBox.bind(this)({ rows: 5, columnWidth: 12, entity: 'card', property: 'answer' }) }
          </div>
          <div>
            <a className={ "btn blue-button standard-width m-bottom" + Common.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              { Details.saveButtonText.call(this) }
            </a>
            <a className={ "btn delete-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Details.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
          <hr className="divider" />
          { EntityTags.renderTags.call(this, 'card') }
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity, createEntity, updateEntity, deleteEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetails);
