export default defineEventHandler(async (event) => {
  try {
    const session = await getAuthSession(event)
    await session.clear()

    return {
      success: true
    }
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al cerrar la sesión'
    })
  }
})
