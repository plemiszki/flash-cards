import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default class _details extends React.Component {
  constructor(props) {
    super(props);
  }

  saveButtonText() {
    return this.state.changesToSave ? "Save" : (this.state.justSaved ? "Saved" : "No Changes");
  }
}
