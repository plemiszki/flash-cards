import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, updateEntity, BottomButtons, Spinner, GrayedOut } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class FrenchCityDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchCity = {
      english: '',
      englishSaved: '',
      french: '',
      frenchSaved: '',
      note: '',
    };

    this.state = {
      spinner: true,
      frenchCity: emptyFrenchCity,
      frenchCitySaved: emptyFrenchCity,
      errors: [],
      frenchCityTags: [],
      tags: [],
      newCardTagModalOpen: false,
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchCity, frenchCityTags, tags } = response;
      this.setState({
        spinner: false,
        frenchCity,
        frenchCitySaved: deepCopy(frenchCity),
        tags,
        frenchCityTags,
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
    return !objectsAreEqual(this.state.frenchCity, this.state.frenchCitySaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'frenchCity',
        entity: this.state.frenchCity,
      }).then((response) => {
        const { frenchCity } = response;
        this.setState({
          spinner: false,
          frenchCity,
          frenchCitySaved: deepCopy(frenchCity),
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
    const { spinner, justSaved, changesToSave, frenchCityTags, tags, frenchCity, frenchCitySaved } = this.state;
    return (
      <>
        <div className="handy-component">
          <h1>French City Details</h1>
          <div className="white-box">
            <div className="row">
              { Details.renderField.bind(this)({ columnWidth: 6, entity: 'frenchCity', property: 'english' }) }
              { Details.renderField.bind(this)({ columnWidth: 6, entity: 'frenchCity', property: 'french' }) }
            </div>
            <div className="row">
              { Details.renderField.bind(this)({
                columnWidth: 12,
                entity: 'frenchCity',
                property: 'url',
                columnHeader: 'Link',
                linkText: frenchCitySaved.url ? 'Visit Link' : null,
                linkUrl: frenchCitySaved.url,
              }) }
            </div>
            <BottomButtons
              entityName="FrenchCity"
              confirmDelete={ Details.confirmDelete.bind(this) }
              justSaved={ justSaved }
              changesToSave={ changesToSave }
              disabled={ spinner }
              clickSave={ () => { this.clickSave() } }
              marginBottom
            />
            <hr />
            <TagsSection
              entity={ frenchCity }
              entityName="FrenchCity"
              entityTags={ frenchCityTags }
              tags={ tags }
              setSpinner={ bool => this.setState({ spinner: bool }) }
              setTags={ (entityTags, tags) => this.setState({ frenchCityTags: entityTags, tags }) }
            />
            <Spinner visible={ spinner } />
            <GrayedOut visible={ spinner } />
          </div>
          <StreakInfo entity={ frenchCity } />
        </div>
      </>
    );
  }
}
