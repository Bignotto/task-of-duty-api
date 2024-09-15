// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeJson = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  )
}
export { safeJson }
