import React from 'react'
import { useLocation } from 'react-router-dom'

const Preferences = () => {

  const { state } = useLocation()
  const store = state?.store

  return (
    <div>Preferences</div>
  )
}

export default Preferences
