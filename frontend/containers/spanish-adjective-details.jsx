import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, Table, updateEntity, BottomButtons, Spinner, GrayedOut, OutlineButton, createEntity, deleteEntity } from 'handy-components'
import TagsSection from './tags-section';

export default class SpanishAdjectiveDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishAdjective = {
      english: '',
      masculine: '',
      masculinePlural: '',
      feminine: '',
      femininePlural: ''
    };

    this.state = {
      spinner: true,
      spanishAdjective: emptySpanishAdjective,
      spanishAdjectiveSaved: emptySpanishAdjective,
      errors: [],
      spanishAdjectiveTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { spanishAdjective, spanishAdjectiveTags, tags } = response;
      this.setState({
        spinner: false,
        spanishAdjective,
        spanishAdjectiveSaved: deepCopy(spanishAdjective),
        tags,
        spanishAdjectiveTags,
        changesToSave: false
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeDropdownField.bind(this) });
      });
    });
  }

  changeFieldArgs() {
    return {
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.spanishAdjective, this.state.spanishAdjectiveSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'spanishAdjective',
        entity: this.state.spanishAdjective,
      }).then((response) => {
        const { spanishAdjective } = response;
        this.setState({
          spinner: false,
          spanishAdjective,
          spanishAdjectiveSaved: deepCopy(spanishAdjective),
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
    const { spinner, justSaved, changesToSave, spanishAdjectiveTags, newCardTagModalOpen, tags, spanishAdjective } = this.state;
    return (
      <div className="handy-component">
        <h1>Spanish Adjective Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'english' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'masculinePlural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'spanishAdjective', property: 'femininePlural' }) }
          </div>
          <BottomButtons
            entityName="spanishAdjective"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ spanishAdjective }
            entityName="SpanishAdjective"
            entityTags={ spanishAdjectiveTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ spanishAdjectiveTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
      </div>
    );
  }
}
