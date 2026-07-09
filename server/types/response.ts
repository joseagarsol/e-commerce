export interface UpdatedResponse<T> {
  success: boolean
  message: string
  updatedEntity: T
}

export interface CreatedResponse<T> {
  success: boolean
  message: string
  createdEntity: T
}

export interface DeletedResponse<T> {
  success: boolean
  message: string
  deletedEntity: T
}
