import React from 'react'
import "./styles/BackBtn.css"
import { Link } from 'react-router-dom'

export default function BackBtn({ path }) {
  return (
    <>
        <Link to={path} className="back-btn">Voltar</Link>
    </>
  )
}
