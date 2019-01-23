import makeDb from '../src/db'
import makeContactList from '../src/contacts/contact-list'
import makeFakeContact from './fixtures/fake-contact'
import { UniqueConstraintError } from '../src/helpers/errors'

const database = makeDb()
const contactList = makeContactList({ database })

describe('Contacts Repository', async () => {
  beforeAll(() => contactList.remove({}))

  it('adds a contact', async () => {
    const dummyContact = makeFakeContact()
    const result = await contactList.add(dummyContact)
    expect(result.success).toBe(true)
    expect(result.created).toHaveProperty('contactId')
    expect(result.created).toEqual({
      ...dummyContact,
      contactId: result.created.contactId
    })
    return contactList.remove(dummyContact)
  })

  it('removes a contact', async () => {
    const dummyContact = makeFakeContact()
    await contactList.add(dummyContact)
    expect(await contactList.remove(dummyContact)).toBe(1)
  })

  it('lists contacts', async () => {
    const fake1 = contactList.add(makeFakeContact())
    const fake2 = contactList.add(makeFakeContact())
    const fake3 = contactList.add(makeFakeContact())
    const fakes = await Promise.all([fake1, fake2, fake3])
    const items = await contactList.getItems()
    expect(items.length).toBe(3)
    await Promise.all(fakes.map(({ created }) => contactList.remove(created)))
  })

  it('supports limits', async () => {
    const fake1 = contactList.add(makeFakeContact())
    const fake2 = contactList.add(makeFakeContact())
    const fake3 = contactList.add(makeFakeContact())
    const fakes = await Promise.all([fake1, fake2, fake3])
    const items = await contactList.getItems({ max: 2 })
    expect(items.length).toBe(2)
    return Promise.all(fakes.map(({ created }) => contactList.remove(created)))
  })

  it('pages forward', async () => {
    const fake1 = contactList.add(makeFakeContact())
    const fake2 = contactList.add(makeFakeContact())
    const fake3 = contactList.add(makeFakeContact())
    const fakes = await Promise.all([fake1, fake2, fake3])
    const items = await contactList.getItems({
      after: fakes[0].created.contactId
    })
    expect(items.length).toBe(2)
    return Promise.all(fakes.map(({ created }) => contactList.remove(created)))
  })

  it('pages backward', async () => {
    const fake1 = contactList.add(makeFakeContact())
    const fake2 = contactList.add(makeFakeContact())
    const fake3 = contactList.add(makeFakeContact())
    const fakes = await Promise.all([fake1, fake2, fake3])
    const items = await contactList.getItems({
      after: fakes[0].created.contactId
    })
    expect(items.length).toBe(2)
    return Promise.all(fakes.map(({ created }) => contactList.remove(created)))
  })

  it('requires new contacts to have a unique email address', async () => {
    expect.assertions(2)

    const dummyContact = makeFakeContact()
    //  await contactList.remove({ emailAddress: dummyContact.emailAddress })
    await contactList.add(dummyContact)
    const duplicateContact = makeFakeContact({
      emailAddress: dummyContact.emailAddress
    })

    await contactList.add(duplicateContact).catch(e => {
      expect(e.message).toBe('emailAddress must be unique.')
      expect(e).toBeInstanceOf(UniqueConstraintError)
    })
    return contactList.remove(dummyContact)
  })

  it('requires new contacts to have a unique contact id', async () => {
    expect.assertions(2)
    const dummyContact = makeFakeContact()
    const { created } = await contactList.add(dummyContact)
    const duplicateContact = makeFakeContact({
      contactId: created.contactId
    })
    await contactList.add(duplicateContact).catch(e => {
      expect(e.message).toBe('contactId must be unique.')
      expect(e).toBeInstanceOf(UniqueConstraintError)
    })
    return contactList.remove(dummyContact)
  })

  it('finds a contact by id', async () => {
    const dummyContact = makeFakeContact()
    const { created } = await contactList.add(dummyContact)
    const result = await contactList.findById(created)
    expect(result).toEqual({
      ...dummyContact,
      contactId: created.contactId
    })
    return contactList.remove(dummyContact)
  })

  it('finds a contact by email address', async () => {
    const dummyContact = makeFakeContact()
    await contactList.remove({ emailAddress: dummyContact.emailAddress })
    const { created } = await contactList.add(dummyContact)
    const found = await contactList.findByEmail(dummyContact)
    expect(found[0]).toEqual({ ...dummyContact, contactId: created.contactId })
    return contactList.remove(dummyContact)
  })
})
