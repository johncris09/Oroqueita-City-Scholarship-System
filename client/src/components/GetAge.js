import React from 'react'

const calculateAge = (value) => {
  try {
    const birthDate = new Date(value)
    const currentDate = new Date()

    const ageInMilliseconds = currentDate - birthDate
    const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))
    return ageInYears
  } catch (error) {
    return value
  }
}

export { calculateAge }
