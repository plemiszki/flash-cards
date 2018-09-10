import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchNoun } from '../actions/index';
import HandyTools from 'handy-tools';

class NounDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: this.props.fetching,
      noun: this.props.noun,
      nounSaved: this.props.nounSaved,
      errors: this.props.errors
    };
  }

  componentDidMount() {
    console.log('comp did mount');
    this.props.fetchNoun(2);
  }

  componentWillReceiveProps(nextProps) {
    console.log('will receive props');
    console.log(nextProps);
  }

  changeFieldArgs() {
    return {
      allErrors: Errors,
      errorsArray: this.state.errors,
      changesFunction: this.checkForChanges.bind(this)
    }
  }

  checkForChanges() {
    return !HandyTools.objectsAreEqual(this.state.noun, this.state.nounSaved);
  }

  clickSave() {
    console.log('save!');
  }

  clickDelete() {
    console.log('delete!');
  }

  render() {
    console.log('render noun details');
    console.log('state: ', this.state);
    console.log('props: ', this.props);
    return (
      <div id="noun-details" className="component details-component">
        <h1>Noun Details</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <div className="row">
            <div className="col-xs-4">
              <h2>English</h2>
              <input className={ HandyTools.errorClass(this.state.errors, Errors.english) } onChange={ HandyTools.changeField.bind(this, this.changeFieldArgs()) } value={ this.state.noun.english } data-entity="noun" data-field="english" />
              { HandyTools.renderFieldError(this.state.errors, Errors.english) }
            </div>
          </div>
          <div>
            <a className={ "btn orange-button standard-width" + HandyTools.renderDisabledButtonClass(this.state.fetching || !this.state.changesToSave) } onClick={ this.clickSave.bind(this) }>
              Save
            </a>
            <a className={ "btn delete-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ this.clickDelete.bind(this) }>
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ nouns }) => {
  console.log('map state to props');
  return {
    fetching: false,
    noun: nouns.noun,
    errors: nouns.errors
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchNoun }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NounDetails);
