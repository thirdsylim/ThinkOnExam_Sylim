// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import contactAppPage from '../pages/contact-app'

Cypress.Commands.add('updateEntry', (rowIndex, newData, confirm=true) => {
    Object.entries(newData).map(([column, value]) => {
        const columnIndex = contactAppPage.indexForColumn(contactAppPage.fieldPlaceholders[column])
        cy.get(`tr:nth-child(${rowIndex}) > td:nth-child(${columnIndex}) > input`).clear()
        cy.get(`tr:nth-child(${rowIndex}) > td:nth-child(${columnIndex}) > input`).type(value)
    })
    if(confirm) {
        contactAppPage.buttonWithName('update').click()
    }
})

Cypress.Commands.add('addEntry', (data) => {
    Object.entries(data).map(([column, value]) => {
        contactAppPage.fieldWithPlaceHolder(contactAppPage.fieldPlaceholders[column]).type(value)    
    })
    contactAppPage.buttonWithName('add').click()
})

Cypress.Commands.add('verifyRow', (rowIndex, data) => {
    Object.entries(data).map(([column, value]) => {
        cy.log(Object.entries(contactAppPage.fieldPlaceholders))
        const columnIndex = contactAppPage.indexForColumn(contactAppPage.fieldPlaceholders[column])
        cy.get(`tbody > tr:nth-child(${rowIndex}) > td:nth-child(${columnIndex})`).should('have.text', value)
    })
})