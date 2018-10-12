import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { standardCreate } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import Details from './modules/details.jsx';

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
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 4, entity: 'noun', property: 'englishPlural', columnHeader: 'English Plural' }) }
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
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'foreign', columnHeader: 'Hindi' }) }
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'foreignPlural', columnHeader: 'Hindi Plural' }) }
          </div>,
          <div key="3" className="row">
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'transliterated' }) }
            { Details.renderField.bind(this)({ columnWidth: 5, entity: 'noun', property: 'transliteratedPlural', columnHeader: 'Transliterated Plural' }) }
          </div>
        ]);
      case 'verb':
        return([
          <div key="1" className="row">
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'verb', property: 'english' }) }
            { Details.renderField.bind(this)({ columnWidth: 6, entity: 'verb', property: 'infinitive' }) }
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
