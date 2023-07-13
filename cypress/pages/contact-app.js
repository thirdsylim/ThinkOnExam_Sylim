class ContactAppPage {
    get columnNames () { return [ 'Name', 'Phone', 'Email', 'Actions' ] }
    get fieldPlaceholders () { 
        return  {
            name: 'Name', 
            phone: 'Phone', 
            email: 'Email'
        }
    }
    indexForColumn(column) { return Object.values(this.fieldPlaceholders).indexOf(column) + 1 }
    fieldWithPlaceHolder(placeholder) { return cy.get(`input[placeholder="${placeholder}"]`) }
    buttonWithName(name) { return cy.get(`button[name="${name}"]`) }
    rowWithValue(value) { return cy.xpath(`//tr[contains(normalize-space(), "${value}")]`) }
}
module.exports = new ContactAppPage()