import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../actions/index';
import Modal from 'react-modal';
import HandyTools from 'handy-tools';
import { Common, Index } from 'handy-components';
import _ from 'lodash';
import FlashCardsCommon from './modules/common.js';
import TabActions from './modules/tab-actions.js';
import NewEntity from './new-entity.jsx';
import Message from './message.jsx';

const directory = window.location.pathname.split('/')[1] || 'quizzes';

class TabbedIndex extends React.Component {
  constructor(props) {
    super(props);

    let initialState = {
      fetching: true,
      entities: [],
      searchProperty: this.props.columns[0],
      searchText: '',
      newEntityModalOpen: false
    }

    if (this.props.tabs) {
      initialState.tab = this.props.tabs[0];
      this.props.tabs.forEach((tab) => {
        initialState[`entities${HandyTools.capitalize(tab)}`] = [];
      })
    }

    this.state = initialState;
  }

  componentDidMount() {
    FlashCardsCommon.checkForMessage.call(this);
    this.props.fetchEntities(directory).then(() => {
      let entityArray;
      if (this.props.tabs) {
        entityArray = `entities${HandyTools.capitalize(this.state.tab)}`;
      } else {
        entityArray = 'entities';
      }
      this.setState({
        fetching: false,
        [entityArray]: this.props.entities
      });
    });
  }

  updateIndex(entities) {
    if (this.props.tabs) {
      this.setState({
        newEntityModalOpen: false,
        [`entities${HandyTools.capitalize(this.props.newEntityTab)}`]: entities
      });
    } else {
      this.setState({
        newEntityModalOpen: false,
        entities: entities
      });
    }
  }

  render() {
    let entities = this.props.tabs ? this.state[`entities${HandyTools.capitalize(this.state.tab)}`] : this.state.entities;
    let filteredEntities = HandyTools.filterSearchText(entities, this.state.searchText, this.state.searchProperty);
    return(
      <div className="component">
        { this.renderMessage() }
        <h1>{ HandyTools.capitalize(this.props.entityNamePlural) }</h1>
        <a className={ "blue-button btn float-button" + Common.renderDisabledButtonClass(this.state.fetching) } onClick={ Index.clickNew.bind(this) }>Add { HandyTools.capitalize(this.props.entityName) }</a>
        <input className="search-box margin" onChange={ Common.changeStateToTarget.bind(this, 'searchText') } value={ this.state.searchText } />
        { this.renderTopTabs() }
        <div className="white-box">
          { Common.renderSpinner(this.state.fetching) }
          { Common.renderGrayedOut(this.state.fetching, -36, -32, 5) }
          <table className="admin-table sortable blue-headers">
            <thead>
              <tr>
                { this.props.columns.map((column, index) => {
                  return(
                    <th key={ index }>
                      <div className={ Index.sortClass.bind(this)(column) } onClick={ Common.changeState.bind(this, 'searchProperty', column) }>
                        { this.props.columnHeaders && this.props.columnHeaders[index] ? this.props.columnHeaders[index] : HandyTools.capitalize(column) }
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
                        <td key={ index } className={ this.props.columnClasses ? this.props.columnClasses[index] : '' }>
                          <a href={ `${directory}/${entity.id}${this.props.columnLinks && this.props.columnLinks[index] ? this.props.columnLinks[index] : ''}` }>
                            { this.renderValue(entity[column], index) }
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
        <Modal isOpen={ this.state.newEntityModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ Common.newEntityModalStyles(this.props.modalDimensions, this.props.modalRows) }>
          <NewEntity entityName={ this.props.entityName } entityNamePlural={ this.props.entityNamePlural } initialEntity={ this.props.initialNewEntity } callback={ this.updateIndex.bind(this) } />
        </Modal>
      </div>
    );
  }

  renderTopTabs() {
    if (this.props.tabs && !this.state.fetching) {
      return(
        <div className="tabs-row">
          { this.props.tabs.map((label, index) => {
            return(
              <div key={ index } className={ "tab" + (this.state.tab === label ? " selected" : "") } onClick={ this.clickTab.bind(this, label) }>{ HandyTools.capitalize(label) }</div>
            );
          })}
        </div>
      );
    }
  }

  clickTab(label) {
    if (this.state.tab !== label) {
      TabActions[`${HandyTools.capitalize(this.props.entityNamePlural)}${HandyTools.capitalize(label)}`].call(this)
    }
  }

  renderValue(value, index) {
    if (this.props.ellipses && this.props.ellipses[index]) {
      return HandyTools.ellipsis(value, this.props.ellipses[index]);
    } else {
      return value;
    }
  }

  renderMessage() {
    if (this.state.message) {
      return (
        <Message color={ this.state.messageColor } text={ this.state.message } clickClose={ () => { Common.changeState.call(this, 'message', '') } } />
      );
    }
  }

  componentDidUpdate() {
    Common.matchColumnHeight();
  }
}

const mapStateToProps = (reducers) => {
  return {
    entities: reducers.standardReducer.entities
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntities }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabbedIndex);
