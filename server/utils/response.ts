import type { UpdatedResponse, CreatedResponse, DeletedResponse, ValidatedResponse } from '../types/response'

export function updatedResponse<T>(message: string, updatedEntity: T): UpdatedResponse<T> {
  return {
    success: true,
    message: message,
    updatedEntity: updatedEntity
  }
}

export function createdResponse<T>(message: string, createdEntity: T): CreatedResponse<T> {
  return {
    success: true,
    message: message,
    createdEntity: createdEntity
  }
}

export function deletedResponse<T>(message: string, deletedEntity: T): DeletedResponse<T> {
  return {
    success: true,
    message: message,
    deletedEntity: deletedEntity
  }
}

export function validatedDataResponse<T>(message: string, data: T): ValidatedResponse<T> {
  return {
    success: true,
    message: message,
    data: data
  }
}
