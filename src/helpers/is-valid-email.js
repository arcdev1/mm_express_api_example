export default function isValidEmail (email) {
  const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  return valid.test(email)
}
