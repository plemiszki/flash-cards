export default {

  checkForMessage() {
    let message = localStorage.getItem('message');
    if (message) {
      this.setState({
        message,
        messageColor: localStorage.getItem('message-color')
      }, () => {
        localStorage.removeItem('message');
        localStorage.removeItem('message-color');
      });
    }
  },

  closeModals() {
    let keys = Object.keys(this.state).filter((key) => {
      return key.slice(-9) === 'ModalOpen';
    });
    let result = {};
    keys.forEach((key) => {
      result[key] = false
    });
    this.setState(result);
  },

  firstElementPropertyOrBlank(array, property) {
    if (array && array.length > 0) {
      return array[0][property];
    } else {
      return "";
    }
  },

  matchColumnHeight() {
    $('.match-height-layout').matchHeight();
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
