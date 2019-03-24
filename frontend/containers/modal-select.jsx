import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Common, Index } from 'handy-components';

class ModalSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ""
    };
  }

  render() {
    return(
      <div className="modal-select">
        <input className="search-box" onChange={ Common.changeStateToTarget.bind(this, 'searchText') } value={ this.state.searchText } data-field="searchText" />
        <ul className="licensor-modal-list">
          { Index.filterSearchText(this.props.options, this.state.searchText, 'name').map(function(option, index) {
            return(
              <li key={ index } onClick={ this.props.func } data-id={ option.id } data-type={ option.itemType }>{ option[this.props.property] }</li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return {
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalSelect);
