import type { DiscountCodeEntity } from '~~/server/types/database'

export function mapDiscountCodeEntityToDiscountCode(discountCodeEntity: DiscountCodeEntity): DiscountCode {
  const isPercent = discountCodeEntity.discountType === 'percent'

  return {
    id: discountCodeEntity.id,
    code: discountCodeEntity.code,
    discountType: discountCodeEntity.discountType,
    apply: discountCodeEntity.apply,
    discount: isPercent ? discountCodeEntity.discount * 100 : discountCodeEntity.discount
  }
}

export function mapDiscountCodeToDiscountCodeEntity(discountCode: Omit<DiscountCode, 'id'>): Omit<DiscountCodeEntity, 'id'> {
  const isPercent = discountCode.discountType === 'percent'

  return {
    code: discountCode.code.toUpperCase(),
    discountType: discountCode.discountType,
    apply: discountCode.apply,
    discount: isPercent ? discountCode.discount / 100 : discountCode.discount
  }
}
