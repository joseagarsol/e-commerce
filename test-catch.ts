export function test() {
  try {
    throw new Error('test')
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error
  }
}
