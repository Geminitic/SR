class NoonlightClient {
  static create(apiKey: string) {
    return new NoonlightClient(apiKey)
  }

  constructor(private apiKey: string) {}
}

export const initRapidSOS = (_userId: string) => {
  const key = process.env.NOONLIGHT_API_KEY || ''
  const client = NoonlightClient.create(key)
  return client
}
