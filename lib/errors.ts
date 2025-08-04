const handleRemoteErrorTracking = (error: Error, context: string) => {
  // TODO: integrate with remote error tracking service
}

export const logError = (error: Error, context: string) => {
  console.error(`[ERROR ${context}]`, error.message)
  handleRemoteErrorTracking(error, context)
  return {}
}
