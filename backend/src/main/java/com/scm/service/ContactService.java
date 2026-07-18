package com.scm.service;

import com.scm.model.Contact;
import com.scm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

// @Service marks this as a business-logic class. Spring creates one
// instance of it and hands it to anything that asks (like the controller).
@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public Contact addContact(Contact contact) {
        contactRepository.findByPhone(contact.getPhone()).ifPresent(existing -> {
            throw new IllegalArgumentException("A contact with this phone number already exists.");
        });
        return contactRepository.save(contact);
    }

    public List<Contact> getAllContacts(String sortBy) {
        if ("name".equalsIgnoreCase(sortBy)) {
            return contactRepository.findAll(Sort.by("name").ascending());
        }
        return contactRepository.findAll();
    }

    public Contact getContactById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Contact not found."));
    }

    public List<Contact> searchByName(String name) {
        return contactRepository.findByNameContainingIgnoreCase(name);
    }

    public Contact updateContact(Long id, Contact updated) {
        Contact existing = getContactById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setAddress(updated.getAddress());
        return contactRepository.save(existing);
    }

    public void deleteContact(Long id) {
        Contact existing = getContactById(id);
        contactRepository.delete(existing);
    }
}
