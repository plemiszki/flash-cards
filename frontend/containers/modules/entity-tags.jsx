import React from 'react'
import Modal from 'react-modal'
import HandyTools from 'handy-tools'
import ChangeCase from 'change-case'
import { Common, Details, ModalSelect, ModalSelectStyles } from 'handy-components'

let EntityTags = {

  updateEntityTags(entityName, entityTags) {
    this.setState({
      fetching: false,
      [`${entityName}Tags`]: entityTags
    });
  },

  deleteEntityTag(entityName, e) {
    let id = e.target.dataset.id;
    this.setState({
      fetching: true
    });
    this.props.deleteEntity({
      directory: 'card_tags',
      id,
      callback: (response) => {
        this.setState({
          fetching: false,
          [`${entityName}Tags`]: response.cardTags
        });
      }
    });
  },

  clickTag(entityName, option) {
    this.setState({
      newCardTagModalOpen: false,
      fetching: true
    }, () => {
      this.props.createEntity({
        directory: 'card_tags',
        entityName: 'cardTag',
        entity: { tagId: option.id, cardtagableId: this.state[entityName].id, cardtagableType: ChangeCase.pascalCase(entityName) }
      }).then(() => {
        EntityTags.updateEntityTags.call(this, entityName, this.props.cardTags);
      });
    });
  },

  renderTags(entityName) {
    return([
      <table key="1" className="admin-table no-links no-hover no-padding m-bottom">
        <thead>
          <tr>
            <th>Tag</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
          </tr>
          { HandyTools.alphabetizeArrayOfObjects(this.state[`${entityName}Tags`], 'tagName').map((entityTag, index) => {
            return(
              <tr key={ index }>
                <td>{ entityTag.tagName }</td>
                <td className="x-column" onClick={ EntityTags.deleteEntityTag.bind(this, entityName) } data-id={ entityTag.id }></td>
              </tr>
            );
          })}
        </tbody>
      </table>,
      <a key="2" className="gray-outline-button small-width small-padding" onClick={ Common.changeState.bind(this, 'newCardTagModalOpen', true) }>Add Tag</a>,
      <Modal key="3" isOpen={ this.state.newCardTagModalOpen } onRequestClose={ Common.closeModals.bind(this) } contentLabel="Modal" style={ ModalSelectStyles }>
        <ModalSelect options={ this.state.tags } property="name" func={ EntityTags.clickTag.bind(this, entityName) } />
      </Modal>
    ]);
  }
};

export default EntityTags;
