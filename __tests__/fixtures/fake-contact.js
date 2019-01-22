import faker from 'faker'
import makeContact from '../../src/contacts/contact'
export default function makeFakeContact (spec = {}) {
  return makeContact({
    emailAddress: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    ...spec
  })
}
