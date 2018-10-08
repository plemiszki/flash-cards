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

  newEntityModalStyles(args) {
    return {
      overlay: {
        background: 'rgba(0, 0, 0, 0.50)'
      },
      content: {
        background: 'white',
        padding: 0,
        margin: 'auto',
        maxWidth: args.width || 1000,
        height: args.height || 359
      }
    }
  }
}
