export default {

  clickNew() {
    this.setState({
      newEntityModalOpen: true
    });
  },

  closeModal() {
    this.setState({
      newEntityModalOpen: false
    });
  },

  newEntityModalStyles(modalDimensions, rows) {
    let height;
    if (rows) {
      height = 121 + (rows * 119);
    } else {
      height = modalDimensions.height || 240;
    }
    return {
      overlay: {
        background: 'rgba(0, 0, 0, 0.50)'
      },
      content: {
        background: 'white',
        padding: 0,
        margin: 'auto',
        maxWidth: modalDimensions.width || 1000,
        height: height
      }
    }
  }
}
