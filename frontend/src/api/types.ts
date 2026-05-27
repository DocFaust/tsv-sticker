export interface UserResponse {
  id: number
  nickname: string
  email: string
  doubles: number[]
  needed: number[]
}

export interface RegisterRequest {
  nickname: string
  email: string
  password: string
}

export interface LoginRequest {
  nickname: string
  password: string
}

export interface StickerListRequest {
  doubles: number[]
  needed: number[]
}

export interface MatchResponse {
  partnerId: number
  partnerNickname: string
  partnerEmail: string
  iCanGive: number[]
  iNeedFrom: number[]
  quality: 'MUTUAL' | 'ONE_SIDED'
}
