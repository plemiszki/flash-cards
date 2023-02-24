import React from 'react'
import { deepCopy, objectsAreEqual, Details, setUpNiceSelect, fetchEntity, Table, updateEntity, BottomButtons, Spinner, GrayedOut, OutlineButton, createEntity, deleteEntity } from 'handy-components'
import TagsSection from './tags-section';

export default class SpanishMiscDetails extends React.Component {
  constructor(props) {
    super(props);

    let emptySpanishMisc = {
      english: '',
      englishSaved: '',
      spanish: '',
      spanishSaved: ''
    };

    this.state = {
      spinner: true,
      spanishMisc: emptySpanishMisc,
      spanishMiscSaved: emptySpanishMisc,
      errors: [],
      spanishMiscTags: [],
      tags: [],
    };
  }

  componentDidMount() {
    fetchEntity().then((response) => {
      const { spanishMisc, spanishMiscTags, tags } = response;
      this.setState({
        spinner: false,
        spanishMisc,
        spanishMiscSaved: deepCopy(spanishMisc),
        tags,
        spanishMiscTags,
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
    return !objectsAreEqual(this.state.spanishMisc, this.state.spanishMiscSaved);
  }

  clickSave() {
    this.setState({
      spinner: true,
      justSaved: true
    }, () => {
      updateEntity({
        entityName: 'spanishMisc',
        entity: this.state.spanishMisc,
      }).then((response) => {
        const { spanishMisc } = response;
        this.setState({
          spinner: false,
          spanishMisc,
          spanishMiscSaved: deepCopy(spanishMisc),
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
    const { spinner, justSaved, changesToSave, spanishMiscTags, tags, spanishMisc } = this.state;
    return (
      <div className="handy-component">
        <h1>Spanish Miscellaneous Word Details</h1>
        <div className="white-box">
          <div className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishMisc', property: 'spanish' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'spanishMisc', property: 'english' }) }
          </div>
          <BottomButtons
            entityName="spanishMisc"
            confirmDelete={ Details.confirmDelete.bind(this) }
            justSaved={ justSaved }
            changesToSave={ changesToSave }
            disabled={ spinner }
            clickSave={ () => { this.clickSave() } }
            marginBottom
          />
          <hr />
          <TagsSection
            entity={ spanishMisc }
            entityName="SpanishMisc"
            entityTags={ spanishMiscTags }
            tags={ tags }
            setSpinner={ bool => this.setState({ spinner: bool }) }
            setTags={ (entityTags, tags) => this.setState({ spanishMiscTags: entityTags, tags }) }
          />
          <Spinner visible={ spinner } />
          <GrayedOut visible={ spinner } />
        </div>
      </div>
    );
  }
}
