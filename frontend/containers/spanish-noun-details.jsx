import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, Table, updateEntity, BottomButtons, Spinner, GrayedOut, OutlineButton, createEntity, deleteEntity } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

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
          <TagsSection
            entity={ spanishNoun }
            entityName="SpanishNoun"
            entityTags={ spanishNounTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ spanishNounTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        <StreakInfo entity={ spanishNoun } />
      </div>
    );
  }
}
