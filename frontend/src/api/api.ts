import axios from 'axios'
import type { LoginRequest, MatchResponse, RegisterRequest, StickerListRequest, UserResponse } from './types'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const api = {
  register: (data: RegisterRequest): Promise<UserResponse> =>
    client.post<UserResponse>('/users/register', data).then(r => r.data),

  login: (data: LoginRequest): Promise<UserResponse> =>
    client.post<UserResponse>('/users/login', data).then(r => r.data),

  getUser: (id: number): Promise<UserResponse> =>
    client.get<UserResponse>(`/users/${id}`).then(r => r.data),

  updateStickers: (id: number, data: StickerListRequest): Promise<UserResponse> =>
    client.put<UserResponse>(`/users/${id}/stickers`, data).then(r => r.data),

  getMatches: (userId: number): Promise<MatchResponse[]> =>
    client.get<MatchResponse[]>(`/matches/${userId}`).then(r => r.data),

  getAllUsers: (): Promise<UserResponse[]> =>
    client.get<UserResponse[]>('/users').then(r => r.data),
}
