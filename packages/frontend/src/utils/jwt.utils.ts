const jwt: any = require('jsonwebtoken')

const secretKey = 'your-secret-key'

interface DecodedData {
  data: string
}

export const encodeString = (str: string): string => {
  const token = jwt.sign({ data: str }, secretKey, { expiresIn: '1h' })
  return token
}

export const decodeString = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as DecodedData
    return decoded.data
  } catch (err) {
    console.error('Error decoding token:', err)
    return null
  }
}
