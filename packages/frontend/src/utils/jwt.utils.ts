import { IDecodedData } from '@/types/common'
import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY || 'SECRET_KEY'

export const encodeString = (str: string): string => {
  const token = jwt.sign({ data: str }, secretKey, { expiresIn: '1h' })
  return token
}

export const decodeString = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, secretKey) as IDecodedData
    return decoded.data
  } catch (err) {
    console.error('Error decoding token:', err)
    return null
  }
}
