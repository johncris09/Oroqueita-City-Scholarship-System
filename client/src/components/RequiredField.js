import React from 'react'
function RequiredFieldNote(label) {
  return (
    <>
      <div>
        <small className="text-muted">
          Note: <span className="text-danger">*</span> is required
        </small>
      </div>
    </>
  )
}
function RequiredField(label) {
  return (
    <>
      <span>
        {label} <span className="text-danger">*</span>
      </span>
    </>
  )
}

export { RequiredField, RequiredFieldNote }
