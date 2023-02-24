import React, { useState } from 'react'
import Modal from 'react-modal'
import { ModalSelectStyles, deleteEntity, createEntity, Table, OutlineButton, ModalSelect } from 'handy-components'

export default function TagsSection({ entity, entityName, entityTags, tags, setSpinner, setTags }) {

  const [modalOpen, setModalOpen] = useState(false);

  const selectTag = (option) => {
    setModalOpen(false)
    setSpinner(true)
    createEntity({
      directory: 'card_tags',
      entityName: 'cardTag',
      entity: { tagId: option.id, cardtagableId: entity.id, cardtagableType: entityName },
    }).then((response) => {
      const { cardTags, tags } = response;
      setSpinner(false)
      setTags(cardTags, tags)
    });
  }

  return (
    <>
      <Table
        columns={[
          { name: 'tagName', header: 'Tags' },
        ]}
        rows={ entityTags }
        marginBottom
        alphabetize
        sortable={ false }
        clickDelete={ (row) => {
          setSpinner(true);
          deleteEntity({
            directory: 'card_tags',
            id: row.id,
          }).then((response) => {
            const { cardTags, tags } = response;
            setSpinner(false);
            setTags(cardTags, tags);
          })
        }}
      />
      <OutlineButton
        color="#5F5F5F"
        text="Add Tag"
        onClick={ () => setModalOpen(true) }
      />
      <Modal isOpen={ modalOpen } onRequestClose={ () => setModalOpen(false) } contentLabel="Modal" style={ ModalSelectStyles }>
        <ModalSelect options={ tags } property="name" func={ option => selectTag(option) } />
      </Modal>
    </>
  );
}
