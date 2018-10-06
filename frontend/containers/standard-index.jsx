import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { standardFetchIndex } from '../actions/index';
import HandyTools from 'handy-tools';
import _ from 'lodash';
import Index from './modules/index.js';

const directory = window.location.pathname.split('/')[1] || 'nouns';

class StandardIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      entities: [],
      searchProperty: this.props.columns[0],
      searchText: ''
    };
  }

  componentDidMount() {
    this.props.standardFetchIndex(directory).then(() => {
      this.setState({
        fetching: false,
        entities: this.props.entities
      });
    });
  }

  render() {
    let filteredEntities = HandyTools.filterSearchText(this.state.entities, this.state.searchText, this.state.searchProperty);
    return(
      <div className="component">
        <h1>{ this.props.entityNamePlural }</h1>
        <a className={ "blue-button btn float-button" + HandyTools.renderDisabledButtonClass(this.state.fetching) } onClick={ Index.clickNew.bind(this) }>Add { this.props.entityName }</a>
        <input className="search-box margin" onChange={ HandyTools.changeStateToTarget.bind(this, 'searchText') } value={ this.state.searchText } />
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <table className="admin-table sortable blue-headers">
            <thead>
              <tr>
                { this.props.columns.map((column, index) => {
                  return(
                    <th key={ index }>
                      <div className={ HandyTools.sortClass.bind(this)(column) } onClick={ HandyTools.changeState.bind(this, 'searchProperty', column) }>
                        { HandyTools.capitalize(column) }
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                { this.props.columns.map((_, index) => {
                  return(
                    <td key={ index }></td>
                  );
                })}
              </tr>
              { _.sortBy(filteredEntities, [HandyTools.commonSort.bind(this)]).map((entity, index) => {
                return(
                  <tr key={ index }>
                    { this.props.columns.map((column, index) => {
                      return(
                        <td key={ index }>
                          <a href={ `${directory}/${entity.id}` }>
                            { entity[column] }
                          </a>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reducers) => {
  return {
    entities: reducers.standardReducer.entities
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ standardFetchIndex }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardIndex);
