import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, updateEntity, BottomButtons, Spinner, GrayedOut, stringifyJSONFields } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class FrenchVerbDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchVerb = {
      english: '',
      englishSaved: '',
      french: '',
      frenchSaved: '',
    };

    this.state = {
      spinner: true,
      frenchVerb: emptyFrenchVerb,
      frenchVerbSaved: emptyFrenchVerb,
      errors: [],
      frenchVerbTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchVerb: rawfrenchVerb, frenchVerbTags, tags } = response;
      const frenchVerb = stringifyJSONFields({ entity: rawfrenchVerb, jsonFields: ['forms'] });
      this.setState({
        spinner: false,
        frenchVerb,
        frenchVerbSaved: deepCopy(frenchVerb),
        tags,
        frenchVerbTags,
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
    return !objectsAreEqual(this.state.frenchVerb, this.state.frenchVerbSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'frenchVerb',
        entity: this.state.frenchVerb,
      }).then((response) => {
        const frenchVerb = stringifyJSONFields({ entity: response.frenchVerb, jsonFields: ['forms'] });
        this.setState({
          spinner: false,
          frenchVerb,
          frenchVerbSaved: deepCopy(frenchVerb),
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
    const { spinner, justSaved, changesToSave, frenchVerbTags, tags, frenchVerb } = this.state;
    return (
      <div className="handy-component">
        <h1>French Verb Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'frenchVerb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'frenchVerb', property: 'french' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'frenchVerb', property: 'note' }) }
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'frenchVerb', property: 'forms', type: 'json', rows: 8 }) }
          </div>
          <BottomButtons
            entityName="FrenchVerb"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ frenchVerb }
            entityName="FrenchVerb"
            entityTags={ frenchVerbTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ frenchVerbTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        <StreakInfo entity={ frenchVerb } />
      </div>
    );
  }
}
