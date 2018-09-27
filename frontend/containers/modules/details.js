export default {

  saveButtonText() {
    return this.state.changesToSave ? 'Save' : (this.state.justSaved ? 'Saved' : 'No Changes');
  },

  clickDelete() {
    this.setState({
      fetching: true
    });
    let urlSections = window.location.pathname.split("/");
    this.props.standardDelete(urlSections[1], urlSections[2]);
  }
}
