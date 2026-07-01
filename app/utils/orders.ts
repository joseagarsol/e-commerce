export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return { label: 'Pagado', color: 'success' as const }
    case 'shipped':
      return { label: 'Enviado', color: 'primary' as const }
    case 'cancelled':
      return { label: 'Cancelado', color: 'error' as const }
    default:
      return { label: 'Pendiente', color: 'warning' as const }
  }
}
