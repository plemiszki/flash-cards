import React from 'react'
import Modal from 'react-modal'
import { fetchEntity } from 'handy-components'

export const modalStyles = {
  overlay: {
    background: 'rgba(0, 0, 0, 0.50)',
  },
  content: {
    background: '#FFFFFF',
    margin: 'auto',
    maxWidth: 500,
    height: 250,
    border: 'solid 1px #5F5F5F',
    borderRadius: '6px',
    textAlign: 'center',
    color: '#5F5F5F',
  }
}

export default class JobStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { job, jobDone } = this.props;
    let interval = window.setInterval(() => {
      fetchEntity({
        id: job.id,
        directory: 'jobs',
        entityName: 'job',
      }).then((response) => {
        const { job } = response;
        if (job.done) {
          clearInterval(interval);
          jobDone(job);
        }
      });
    }, 1000);
  }

  render() {
    const { job, isOpen } = this.props;
    if (!job) {
      return null;
    }
    return (
      <>
        <Modal
          isOpen={ isOpen }
          style={ modalStyles }
        >
          <div className="job-status jobs-modal">
            <div className="inner">
              <div className="spinner"></div>
              <p>{ job.text }</p>
              { job.showProgress && (
                <p className="progress-text">{ job.currentValue } of { job.totalValue }</p>
              ) }
            </div>
          </div>
        </Modal>
        <style jsx>{`
          .job-status {
            color: black;
            height: 100%;
            display: flex;
            align-items: center;
          }
          .inner {
            margin: auto;
          }
          p:first-of-type {
            font-family: 'TeachableSans-Medium';
            font-size: 24px;
            line-height: 30px;
          }
          p.progress-text {
            margin-top: 10px;
            font-family: 'TeachableSans-Regular';
            font-size: 20px;
            line-height: 20px;
          }
          .spinner {
            position: relative;
            margin: auto;
            width: 75px;
            height: 75px;
            margin-bottom: 20px;
          }
        `}</style>
      </>
    );
  }
}
