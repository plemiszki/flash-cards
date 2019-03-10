let TabActions = {

  CardsArchived() {
    if (this.state.entitiesArchived.length == 0) {
      this.setState({
        tab: 'archived',
        fetching: true
      }, () => {
        this.props.fetchEntities('cards_archived').then(() => {
          this.setState({
            fetching: false,
            entitiesArchived: this.props.entities
          });
        });
      });
    } else {
      this.setState({
        tab: 'archived'
      });
    }
  },

  CardsCurrent() {
    this.setState({
      tab: 'current'
    });
  }
}

export default TabActions;