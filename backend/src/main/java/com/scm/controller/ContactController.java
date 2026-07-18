package com.scm.controller;

import com.scm.model.Contact;
import com.scm.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

// @RestController + @RequestMapping means every method below is reachable
// over HTTP at /api/contacts/... and automatically returns JSON.
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    // POST /api/contacts
    @PostMapping
    public ResponseEntity<?> addContact(@Valid @RequestBody Contact contact) {
        try {
            Contact saved = contactService.addContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/contacts?sortBy=name
    @GetMapping
    public List<Contact> getAllContacts(@RequestParam(required = false) String sortBy) {
        return contactService.getAllContacts(sortBy);
    }

    // GET /api/contacts/5
    @GetMapping("/{id}")
    public ResponseEntity<?> getContact(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(contactService.getContactById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/contacts/search?name=John
    @GetMapping("/search")
    public List<Contact> searchByName(@RequestParam String name) {
        return contactService.searchByName(name);
    }

    // PUT /api/contacts/5
    @PutMapping("/{id}")
    public ResponseEntity<?> updateContact(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        try {
            return ResponseEntity.ok(contactService.updateContact(id, contact));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/contacts/5
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
