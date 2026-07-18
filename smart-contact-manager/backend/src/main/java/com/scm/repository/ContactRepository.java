package com.scm.repository;

import com.scm.model.Contact;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Extending JpaRepository gives you save(), findAll(), findById(), delete()
// and more for free -- no SQL, no ArrayList, no HashMap to maintain by hand.
// You only need to declare the extra lookups that aren't built in.
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByPhone(String phone);

    List<Contact> findByNameContainingIgnoreCase(String name);

    // Overload used for the "sort by name" feature
    List<Contact> findAll(Sort sort);
}
