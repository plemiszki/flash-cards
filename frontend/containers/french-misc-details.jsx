import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, Table, updateEntity, BottomButtons, Spinner, GrayedOut, OutlineButton, createEntity, deleteEntity } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class FrenchMiscDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchMisc = {
      english: '',
      englishSaved: '',
      french: '',
      frenchSaved: ''
    };

    this.state = {
      spinner: true,
      frenchMisc: emptyFrenchMisc,
      frenchMiscSaved: emptyFrenchMisc,
      errors: [],
      frenchMiscTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchMisc, frenchMiscTags, tags } = response;
      this.setState({
        spinner: false,
        frenchMisc,
        frenchMiscSaved: deepCopy(frenchMisc),
        tags,
        frenchMiscTags,
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
    return !objectsAreEqual(this.state.frenchMisc, this.state.frenchMiscSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'frenchMisc',
        entity: this.state.frenchMisc,
      }).then((response) => {
        const { frenchMisc } = response;
        this.setState({
          spinner: false,
          frenchMisc,
          frenchMiscSaved: deepCopy(frenchMisc),
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
    const { spinner, justSaved, changesToSave, frenchMiscTags, tags, frenchMisc } = this.state;
    return (
      <div className="handy-component">
        <h1>French Miscellaneous Word Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'frenchMisc', property: 'french' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'frenchMisc', property: 'english' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 12, entity: 'frenchMisc', property: 'url', columnHeader: 'Link' }) }
          </div>
          <BottomButtons
            entityName="FrenchMisc"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ frenchMisc }
            entityName="FrenchMisc"
            entityTags={ frenchMiscTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ frenchMiscTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        <StreakInfo entity={ frenchMisc } />
      </div>
    );
  }
}
