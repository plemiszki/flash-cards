import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { standardCreate } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';

class NewEntity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity),
      errors: []
    };
  }

  componentDidMount() {
    HandyTools.setUpNiceSelect({ selector: 'select', func: HandyTools.changeField.bind(this, this.changeFieldArgs()) });
  }

  clickAdd(e) {
    e.preventDefault();
    this.setState({
      fetching: true
    });
    this.props.standardCreate({
      directory: this.props.entityNamePlural,
      entityName: this.props.entityName,
      entity: this.state[this.props.entityName]
    }).then(() => {
      this.setState({
        fetching: false,
        [this.props.entityName]: HandyTools.deepCopy(this.props.initialEntity)
      });
      this.props.updateIndex(this.props.entities);
    }, () => {
      this.setState({
        fetching: false,
        errors: this.props.errors
      });
    });
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors
    }
  }

  render() {
    return(
      <div className="component admin-modal">
        <form className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          { this.renderFields() }
          <input type="submit" className={ "blue-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } value={ `Add ${HandyTools.capitalize(this.props.entityName)}` } onClick={ this.clickAdd.bind(this) } />
        </form>
      </div>
    );
  }

  renderFields() {
    switch (this.props.entityName) {
      case 'noun':
        return([
          <div key="1" className="row">
            <div className="col-xs-5">
              <h2>English</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.english) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.english || "" } data-entity="noun" data-field="english" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
            <div className="col-xs-5">
              <h2>English Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.englishPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.englishPlural || "" } data-entity="noun" data-field="englishPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.englishPlural) }
            </div>
            <div className="col-xs-2">
              <h2>Gender</h2>
              <select onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.gender } data-entity="noun" data-field="gender">
                <option value={ "1" }>Male</option>
                <option value={ "2" }>Female</option>
              </select>
              { HandyTools.renderDropdownFieldError([], []) }
            </div>
          </div>,
          <div key="2" className="row">
            <div className="col-xs-5">
              <h2>Hindi</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.foreign) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.foreign || "" } data-entity="noun" data-field="foreign" />
              { HandyTools.renderFieldError(this.state.errors, Errors.foreign) }
            </div>
            <div className="col-xs-5">
              <h2>Hindi Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.foreignPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.foreignPlural || "" } data-entity="noun" data-field="foreignPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.foreignPlural) }
            </div>
          </div>,
          <div key="3" className="row">
            <div className="col-xs-5">
              <h2>Transliterated</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.transliterated) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.transliterated || "" } data-entity="noun" data-field="transliterated" />
              { HandyTools.renderFieldError(this.state.errors, Errors.transliterated) }
            </div>
            <div className="col-xs-5">
              <h2>Transliterated Plural</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.transliteratedPlural) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.transliteratedPlural || "" } data-entity="noun" data-field="transliteratedPlural" />
              { HandyTools.renderFieldError(this.state.errors, Errors.transliteratedPlural) }
            </div>
          </div>
        ]);
      case 'verb':
        return([
          <div key="1" className="row">
            <div className="col-xs-6">
              <h2>English</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.english) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.verb.english || "" } data-entity="verb" data-field="english" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
            <div className="col-xs-6">
              <h2>Infinitive</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.infinitive) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.verb.infinitive || "" } data-entity="verb" data-field="infinitive" />
              { HandyTools.renderFieldError(this.state.errors, Errors.infinitive) }
            </div>
          </div>
        ]);
    }
  }
}

const mapStateToProps = (reducers) => {
  return {
    entities: reducers.standardReducer.entities,
    errors: reducers.standardReducer.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ standardCreate }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewEntity);
