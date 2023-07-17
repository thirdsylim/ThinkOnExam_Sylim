import contactAppPage from '../pages/contact-app'
import utils from './utility/utils'

describe('Test Contact App', () => {

  beforeEach(() => {
    cy.visit('./contact_app.html')
  })

  it('Test if the application loads correctly', () => {
    cy.get('h1.text-center').should('have.text', 'Contact List App');
    cy.get('table tbody tr').should('have.length', 1)
    Object.values(contactAppPage.fieldPlaceholders).map(placeholder => {
      contactAppPage.fieldWithPlaceHolder(placeholder).should('be.visible')
    })
    contactAppPage.columnNames.map((columnName, index) => {
      cy.get(`th:nth-of-type(${index+1})`).should('have.text', columnName)
    })
  })

  // Add tests here
  describe('create entries', () => {
    it('can add an entry with all valid fields', () => {
      const timeStamp = utils.makeTimestamp()
      const data = { 
        name: `Add Test ${timeStamp}`,
        phone : '1234567890',
        email : `addTest${timeStamp}@email.com`
      }
      cy.addEntry(data)      

      cy.get('tbody > tr').should('have.length', 2)
      cy.verifyRow(2, data)
    })

    it('can add entry with no phone', () => {
      const timeStamp = utils.makeTimestamp()
      const data = { 
        name: `Add Test ${timeStamp}`,
        email : `addTest${timeStamp}@email.com`
      }
      cy.addEntry(data)      

      cy.get('tbody > tr').should('have.length', 2)
      cy.verifyRow(2, data)
    })

    it('can add entry with no email', () => {
      const timeStamp = utils.makeTimestamp()
      const data = { 
        name: `Add Test ${timeStamp}`,
        phone : '1234567890',
      }
      cy.addEntry(data)      

      cy.get('tbody > tr').should('have.length', 2)
      cy.verifyRow(2, data)
    })

    // Will fail because of no validation
    it('can not add an entry with all fields blank', () => {
      contactAppPage.buttonWithName('add').click()
      cy.get('tbody > tr').should('have.length', 1)
      // verify error message
    })

    it('can not add entry with invalid email', () => {
      const timeStamp = utils.makeTimestamp()
      const data = { 
        name: `Add Test ${timeStamp}`,
        phone : '1234567890',
        email : `addTest${timeStamp}`
      }
      cy.addEntry(data)      

      // error message should be shown
      cy.get('tbody > tr').should('have.length', 1)
    })

    it('can not add entry with invalid phone number', () => {
      const timeStamp = utils.makeTimestamp()
      const data = { 
        name: `Add Test ${timeStamp}`,
        phone : 'abcd12345',
        email : `addTest${timeStamp}@email.com`
      }
      cy.addEntry(data)      

      // error message should be shown
      cy.get('tbody > tr').should('have.length', 1)
    })
  })

  describe('update entries', () => {
    let data = { 
      name : undefined, 
      phone : undefined,
      email : undefined
    }
    let rowIndex
    let newData

    beforeEach(() => {
      const timeStamp = utils.makeTimestamp()
      data = { 
        name: `Update Test ${timeStamp}`,
        phone : '1234567890',
        email : `updateTest${timeStamp}@email.com`
      }
      cy.addEntry(data)
      contactAppPage.rowWithValue(data.email).should('be.visible')

      cy.get('tr').each((element, index) => {
        cy.get(element).invoke('text').then((text) => {
          cy.log(index)
          if(text.includes(data.email)) {
            rowIndex = index + 1
          }
        })
      })
      cy.log(rowIndex)
      contactAppPage.rowWithValue(data.email).xpath('.//button[@name="edit"]').click()

      newData = { 
        name: `UPDATED New Data Test ${timeStamp}`,
        phone : '999888777',
        email : `updateTest.newData${timeStamp}@email.com`
      }
    })

    it('can successfully update an entire entry with valid input', () => {
      cy.updateEntry(rowIndex, newData)

      cy.verifyRow(2, newData)
      contactAppPage.rowWithValue(data.email).should('not.be.visible')
    })

    Object.keys(data).map(column => {
      it(`can successfully update an entry when updating only ${column}`, () => {
        const oldData = data[column]
        data[column] = newData[column]
        cy.updateEntry(rowIndex, data)
        cy.verifyRow(2,data)
        contactAppPage.rowWithValue(oldData).should('not.exist')
      })
    })

    it('can not update entry with invalid email', () => {
      const newData = {
        email : 'malformedemail'
      }
      cy.updateEntry(rowIndex, newData)
      cy.verifyRow(2,data)
      contactAppPage.rowWithValue(newData.email).should('not.exist')
    })

    it('can not update entry with invalid phone number', () => {
      const newData = {
        phone : 'abc123'
      }
      cy.updateEntry(rowIndex, newData)
      cy.verifyRow(2,data)
      contactAppPage.rowWithValue(newData.phone).should('not.exist')
    })
  })

  describe('delete', () => {
    let data 

    beforeEach(() => {
      const timeStamp = utils.makeTimestamp()
      data = { 
        name: `Update Test ${timeStamp}`,
        phone : '1234567890',
        email : `updateTest${timeStamp}@email.com`
      }
      cy.addEntry(data)
      contactAppPage.rowWithValue(data.email).should('be.visible')
    })

    it('can delete an entry', () => {
      contactAppPage.rowWithValue(data.email).xpath('.//button[@name="delete"]').click()
      cy.get('tbody > tr').should('have.length', 1)
      contactAppPage.rowWithValue(data.email).should('not.exist')
    })
  })
});