import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, updateEntity, BottomButtons, Spinner, GrayedOut, stringifyJSONFields } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class SpanishVerbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishVerb = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: '',
    };

    this.state = {
      spinner: true,
      spanishVerb: emptySpanishVerb,
      spanishVerbSaved: emptySpanishVerb,
      errors: [],
      spanishVerbTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { spanishVerb: rawSpanishVerb, spanishVerbTags, tags } = response;
      const spanishVerb = stringifyJSONFields({ entity: rawSpanishVerb, jsonFields: ['forms'] });
      this.setState({
        spinner: false,
        spanishVerb,
        spanishVerbSaved: deepCopy(spanishVerb),
        tags,
        spanishVerbTags,
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
    return !objectsAreEqual(this.state.spanishVerb, this.state.spanishVerbSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'spanishVerb',
        entity: this.state.spanishVerb,
      }).then((response) => {
        const spanishVerb = stringifyJSONFields({ entity: response.spanishVerb, jsonFields: ['forms'] });
        this.setState({
          spinner: false,
          spanishVerb,
          spanishVerbSaved: deepCopy(spanishVerb),
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
    const { spinner, justSaved, changesToSave, spanishVerbTags, tags, spanishVerb } = this.state;
    return (
      <div className="handy-component">
        <h1>Spanish Verb Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishVerb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishVerb', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'spanishVerb', property: 'note' }) }
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'spanishVerb', property: 'forms', type: 'json', rows: 8 }) }
          </div>
          <BottomButtons
            entityName="spanishVerb"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ spanishVerb }
            entityName="SpanishVerb"
            entityTags={ spanishVerbTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ spanishVerbTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        <StreakInfo entity={ spanishVerb } />
      </div>
    );
  }
}
