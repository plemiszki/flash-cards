import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, updateEntity, BottomButtons, Spinner, GrayedOut } from 'handy-components'
import TagsSection from './tags-section';
import StreakInfo from './streak-info';

export default class FrenchAdjectiveDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptyFrenchAdjective = {
      english: '',
      masculine: '',
      masculinePlural: '',
      feminine: '',
      femininePlural: ''
    };

    this.state = {
      spinner: true,
      frenchAdjective: emptyFrenchAdjective,
      frenchAdjectiveSaved: emptyFrenchAdjective,
      errors: [],
      frenchAdjectiveTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { frenchAdjective, frenchAdjectiveTags, tags } = response;
      this.setState({
        spinner: false,
        frenchAdjective,
        frenchAdjectiveSaved: deepCopy(frenchAdjective),
        tags,
        frenchAdjectiveTags,
        changesToSave: false,
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
    return !objectsAreEqual(this.state.frenchAdjective, this.state.frenchAdjectiveSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true,
    }, () => {
      updateEntity({
        entityName: 'frenchAdjective',
        entity: this.state.frenchAdjective,
      }).then((response) => {
        const { frenchAdjective } = response;
        this.setState({
          spinner: false,
          frenchAdjective,
          frenchAdjectiveSaved: deepCopy(frenchAdjective),
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

  render() {
    const { spinner, justSaved, changesToSave, frenchAdjectiveTags, tags, frenchAdjective, frenchAdjectiveSaved } = this.state;
    return (
      <div className="handy-component">
        <h1>French Noun Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'frenchAdjective', property: 'english' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'frenchAdjective', property: 'masculine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'frenchAdjective', property: 'masculinePlural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'frenchAdjective', property: 'feminine' }) }
            { Details.renderField.bind(this)({ columnWidth: 3, entity: 'frenchAdjective', property: 'femininePlural' }) }
          </div>
          <div className="row">
            { Details.renderField.bind(this)({
              columnWidth: 12,
              entity: 'frenchAdjective',
              property: 'url',
              columnHeader: 'Link',
              linkText: frenchAdjectiveSaved.url ? 'Visit Link' : null,
              linkUrl: frenchAdjectiveSaved.url,
            }) }
          </div>
          <BottomButtons
            entityName="FrenchAdjective"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ frenchAdjective }
            entityName="FrenchAdjective"
            entityTags={ frenchAdjectiveTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ frenchAdjectiveTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
        <StreakInfo entity={ frenchAdjective } />
      </div>
    );
  }
}
