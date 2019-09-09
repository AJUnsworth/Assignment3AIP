/// <reference types="Cypress" />

describe('Sceneit Registration', () => {
  const username = "test123";  
  const email = "test123@test.com";
  const pass = "123test"

  beforeEach(() => {
    cy.visit('/loginContainer');
  })

    it('visits the registration/login page', () => {
      cy.visit('/loginContainer')
    })

    it('should contain register header', () => {
      cy.contains("Register for an account today!")
    })

    it('should throw an error for different password and confirmPassword', () => {
      //Fill out the form
      cy.get('input[name=username]').type(username);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type(pass);
      cy.get('input[name=confirmPassword]').type("incorrectpassword");
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Passwords must be identical')
    })

    it('should throw an error for incorrect password length', () => {
      //Fill out the form
      cy.get('input[name=username]').type(username);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type("short");
      cy.get('input[name=confirmPassword]').type("short");
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Password must be at least 6 characters long')
    })

    it('should throw an error for missing username field', () => {
      //Fill out the form
      cy.get('input[name=email]').type(email);
      cy.get('input[name=password]').type(pass);
      cy.get('input[name=confirmPassword]').type(pass);
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Username field is required')
    })

    it('should throw an error for missing email field', () => {
      //Fill out the form
      cy.get('input[name=username]').type(email);
      cy.get('input[name=password]').type(pass);
      cy.get('input[name=confirmPassword]').type(pass);
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Please enter a valid email address')
    })

    it('should throw an error for missing password field', () => {
      //Fill out the form
      cy.get('input[name=username]').type(email);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=confirmPassword]').type(pass);
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Password must be at least 6 characters long')
    })

    it('should throw an error for missing confirmPassword field', () => {
      //Fill out the form
      cy.get('input[name=username]').type(email);
      cy.get('input[name=email]').type(email);
      cy.get('input[name=confirmPassword]').type(pass);
      cy.get('button[name=registerBtn]').click();
      //Display error message
      cy.contains('Passwords must be identical')
    })
  })