import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, updateEntity, BottomButtons, Spinner, GrayedOut } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class FrenchCountryDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchCountry = {
      english: '',
      englishSaved: '',
      french: '',
      frenchSaved: '',
      note: '',
    };

    this.state = {
      spinner: true,
      frenchCountry: emptyFrenchCountry,
      frenchCountrySaved: emptyFrenchCountry,
      errors: [],
      frenchCountryTags: [],
      tags: [],
      newCardTagModalOpen: false,
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchCountry, frenchCountryTags, tags } = response;
      this.setState({
        spinner: false,
        frenchCountry,
        frenchCountrySaved: deepCopy(frenchCountry),
        tags,
        frenchCountryTags,
        changesToSave: false,
      }, () => {
        setUpNiceSelect({ selector: 'select', func: Details.changeDropdownField.bind(this) });
      });
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this),
    }
  }

  checkForChanges() {
    return !objectsAreEqual(this.state.frenchCountry, this.state.frenchCountrySaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'frenchCountry',
        entity: this.state.frenchCountry,
      }).then((response) => {
        const { frenchCountry } = response;
        this.setState({
          spinner: false,
          frenchCountry,
          frenchCountrySaved: deepCopy(frenchCountry),
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
    const { spinner, justSaved, changesToSave, frenchCountryTags, tags, frenchCountry, frenchCountrySaved } = this.state;
    return (
      <>
        <div className="handy-component">
          <h1>French Country Details</h1>
          <div className="white-box">
            <div className="row">
              { Details.renderField.bind(this)({ columnWidth: 5, entity: 'frenchCountry', property: 'english' }) }
              { Details.renderField.bind(this)({ columnWidth: 5, entity: 'frenchCountry', property: 'french' }) }
              <div className="col-xs-2">
                <h2>Gender</h2>
                <select onChange={ Details.changeField.bind(this, this.changeFieldArgs()) } value={ frenchCountry.gender } data-entity="frenchCountry" data-field="gender">
                  <option value={ "1" }>Male</option>
                  <option value={ "2" }>Female</option>
                </select>
                { Details.renderFieldError([], []) }
              </div>
            </div>
            <div className="row">
              { Details.renderField.bind(this)({
                columnWidth: 12,
                entity: 'frenchCountry',
                property: 'url',
                columnHeader: 'Link',
                linkText: frenchCountrySaved.url ? 'Visit Link' : null,
                linkUrl: frenchCountrySaved.url,
              }) }
            </div>
            <BottomButtons
              entityName="FrenchCountry"
              confirmDelete={ Details.confirmDelete.bind(this) }
              justSaved={ justSaved }
              changesToSave={ changesToSave }
              disabled={ spinner }
              clickSave={ () => { this.clickSave() } }
              marginBottom
            />
            <hr />
            <TagsSection
              entity={ frenchCountry }
              entityName="FrenchCountry"
              entityTags={ frenchCountryTags }
              tags={ tags }
              setSpinner={ bool => this.setState({ spinner: bool }) }
              setTags={ (entityTags, tags) => this.setState({ frenchCountryTags: entityTags, tags }) }
            />
            <Spinner visible={ spinner } />
            <GrayedOut visible={ spinner } />
          </div>
          <StreakInfo entity={ frenchCountry } />
        </div>
      </>
    );
  }
}
