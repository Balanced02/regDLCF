import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'

import { clearInfo } from '../actions/feedback'

const AlertComponent = ({ dispatch, infos }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '5px',
        right: '5px',
        zIndex: 99999999,
      }}
    >
      <div className="alertBox">
        {infos.reverse().map((info, i) =>
          <Alert color={info.color || 'success' } key={i} toggle={() => dispatch(clearInfo(info.id))}>
          <h4 className="alert-heading">{info.color === 'success' ? 'Info 👌🏽' : info.color === 'warning' ? 'Warning' :  'Error!!!' }</h4>
          <p>  {info.info} </p>
          </Alert>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    infos: state.feedback.infos,
  }
}
export default connect(mapStateToProps)(AlertComponent)