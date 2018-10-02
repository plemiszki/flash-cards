import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { standardFetchIndex } from '../actions/index';
import HandyTools from 'handy-tools';

const directory = window.location.pathname.split('/')[1];

class StandardIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: true,
      entities: []
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
    return(
      <div className="component">
        <h1>{ this.props.entityNamePlural }</h1>
        <div className="white-box">
          { HandyTools.renderSpinner(this.state.fetching) }
          { HandyTools.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <table className="admin-table">
            <thead>
              <tr>
                { this.props.columns.map((column, index) => {
                  return(
                    <th key={ index }>
                      { HandyTools.capitalize(column) }
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
              { this.state.entities.map((entity, index) => {
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
