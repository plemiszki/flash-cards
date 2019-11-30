import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchEntity } from '../actions/index'

class JobStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { job } = this.props;
    let interval = window.setInterval(() => {
      this.props.fetchEntity({
        id: job.id,
        directory: 'jobs',
        entityName: 'job'
      }).then(() => {
        if (this.props.job.done) {
          clearInterval(interval);
          this.props.jobDone(this.props.job);
        }
      });
    }, 1000);
  }

  render() {
    return(
      <div className="job-status vertically-align-contents">
        <div className="inner">
          <div className="spinner"></div>
          <p>{ this.props.job.text }</p>
          { this.renderProgress() }
        </div>
      </div>
    );
  }

  renderProgress() {
    const { job } = this.props;
    if (job.showProgress) {
      return(
        <p>{ job.currentValue } of { job.totalValue }</p>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (reducers, props) => {
  return reducers.standardReducer;
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(JobStatus);
