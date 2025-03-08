import { CheckIn, Prisma } from '@prisma/client'
export interface CheckInServiceInterface {
  userId: string,
  gymId: string,
  userLatitude: number,
  userLongitude: number
}
export interface CheckInServiceResponse {
  checkIn: CheckIn
}
export interface CheckInServiceHistoryInterface {
  userId: string,
  page: number
}
export interface CheckInServiceHistoryResponse {
  checkIns: CheckIn[]
}
export interface CheckInServiceNumberInterface {
  userId: string
}
export interface CheckInServiceNumberResponse {
  checkInsCount: number
}
export interface CheckInRepositoryInterface {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> //CheckInUncheckedCreateInput to put fileds of relationship (userId, gymId)
  findByUserIdAndDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
}