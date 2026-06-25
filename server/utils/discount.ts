import type { Promotion } from '~/types/promotion'
import type { discountCodes } from '../db/schema'

export function mapDiscountToDTO(dbDiscount: typeof discountCodes.$inferSelect): Promotion {
  const isPercent = dbDiscount.discountType === 'percent'

  return {
    id: dbDiscount.id,
    code: dbDiscount.code,
    discountType: dbDiscount.discountType,
    apply: dbDiscount.apply,
    discount: isPercent ? dbDiscount.discount * 100 : dbDiscount.discount
  }
}

export function mapDTOToDB(dto: Omit<Promotion, 'id'>) {
  const isPercent = dto.discountType === 'percent'

  return {
    code: dto.code.toUpperCase(),
    discountType: dto.discountType,
    apply: dto.apply,
    discount: isPercent ? dto.discount / 100 : dto.discount
  }
}
