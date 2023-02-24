import React from 'react'
import Modal from 'react-modal'
import { Common, ModalSelect, ModalSelectStyles, deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, Table, updateEntity, BottomButtons, Spinner, GrayedOut, OutlineButton, createEntity, deleteEntity } from 'handy-components'

export default class SpanishNounDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishNoun = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: '',
      note: '',
    };

    this.state = {
      spinner: true,
      spanishNoun: emptySpanishNoun,
      spanishNounSaved: emptySpanishNoun,
      errors: [],
      spanishNounTags: [],
      tags: [],
      newCardTagModalOpen: false,
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { spanishNoun, spanishNounTags, tags } = response;
      this.setState({
        spinner: false,
        spanishNoun,
        spanishNounSaved: deepCopy(spanishNoun),
        tags,
        spanishNounTags,
        changesToSave: false
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeDropdownField.bind(this) });
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
    return !objectsAreEqual(this.state.spanishNoun, this.state.spanishNounSaved);
  }

  selectTag(option) {
    const { spanishNoun } = this.state;
    this.setState({
      newCardTagModalOpen: false,
      spinner: true
    }, () => {
      createEntity({
        directory: 'card_tags',
        entityName: 'cardTag',
        entity: { tagId: option.id, cardtagableId: spanishNoun.id, cardtagableType: 'SpanishNoun' },
      }).then((response) => {
        const { cardTags, tags } = response;
        this.setState({
          spanishNounTags: cardTags,
          spinner: false,
          tags,
        })
      });
    });
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'spanishNoun',
        entity: this.state.spanishNoun,
      }).then((response) => {
        const { spanishNoun } = response;
        this.setState({
          spinner: false,
          spanishNoun,
          spanishNounSaved: deepCopy(spanishNoun),
          changesToSave: false
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

  render() {
    const { spinner, justSaved, changesToSave, spanishNounTags, newCardTagModalOpen, tags, spanishNoun } = this.state;
    return (
      <div className="handy-component">
        <h1>Spanish Noun Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'englishPlural' }) }
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ spanishNoun.gender } data-entity="spanishNoun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { Details.renderFieldError([], []) }
            </div>
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'spanishPlural' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishNoun', property: 'note' }) }
          </div>
          <BottomButtons
            entityName="spanishNoun"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <Table
            columns={[
              { name: 'tagName', header: 'Tags' },
            ]}
            rows={ spanishNounTags }
            marginBottom
            alphabetize
            sortable={ false }
            clickDelete={ (row) => {
              this.setState({
                spinner: true,
              });
              deleteEntity({
                directory: 'card_tags',
                id: row.id,
              }).then((response) => {
                const { cardTags, tags } = response;
                this.setState({
                  spinner: false,
                  spanishNounTags: cardTags,
                  tags,
                });
              })
            }}
          />
          <OutlineButton
            color="#5F5F5F"
            text="Add Tag"
            onClick={ () => this.setState({ newCardTagModalOpen: true }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
          <Modal isOpen={ newCardTagModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ ModalSelectStyles }>
            <ModalSelect options={ tags } property="name" func={ (option) => this.selectTag(option) } />
          </Modal>
        </div>
      </div>
    );
  }
}
