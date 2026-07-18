package com.scm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This one annotation replaces your old console Main.java's job:
// it boots up a web server and wires all your @Service/@RestController
// classes together automatically.
@SpringBootApplication
public class SmartContactManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartContactManagerApplication.class, args);
    }
}
