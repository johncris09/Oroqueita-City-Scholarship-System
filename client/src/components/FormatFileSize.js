import React from 'react'

const FormatFileSize = (size) => {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(size) / Math.log(k)))
  return Math.round(100 * (size / Math.pow(k, i))) / 100 + ' ' + sizes[i]
}

export default FormatFileSize
