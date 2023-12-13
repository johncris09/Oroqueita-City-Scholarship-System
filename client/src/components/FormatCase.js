import React from 'react'

const toSentenceCase = (value) => {
  try {
    return value
      .toLowerCase()
      .split(' ')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ')
  } catch (error) {
    return value
  }
}

export { toSentenceCase }
