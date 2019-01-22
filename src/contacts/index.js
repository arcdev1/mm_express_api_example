import makeDb from '../db'
import makeContactList from './contact-list'
import makeContactsEndpointHandler from './contacts-endpoint'

const database = makeDb()
const contactList = makeContactList({ database })
const contactsEndpointHandler = makeContactsEndpointHandler({ contactList })

export default contactsEndpointHandler
