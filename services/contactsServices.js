import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const filePath = path.resolve('src', 'db', 'contacts.json');

async function readContacts() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeContacts(contacts) {
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
    const contacts = await readContacts();
    return contacts;
}

async function getContactById(contactId) {
    const contacts = await readContacts();
    const contact = contacts.find(contact => contact.id === contactId);
    return contact || null;
}

async function removeContact(contactId) {
    const contacts = await readContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) return null;
    const removedContact = contacts.splice(index, 1)[0];
    await writeContacts(contacts);
    return removedContact;
}

async function addContact(name, email, phone) {
    const contacts = await readContacts();
    const newContact = { id: randomUUID(), name, email, phone };
    contacts.push(newContact);
    await writeContacts(contacts);
    return newContact;
}

export { listContacts, getContactById, removeContact, addContact };