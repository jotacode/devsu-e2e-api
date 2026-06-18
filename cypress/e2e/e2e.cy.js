/// <reference types="cypress"/>

function getRandom(){
    return Cypress._.random(8)
}

function addToCart( ){
    cy.get('.btn.btn-success.btn-lg').should('be.visible')
    cy.get('.btn.btn-success.btn-lg').click() //add to cart
    cy.on('window:confirm', () => true)
}

it('add 2 products to the cart and complete the purchase', ()=>{

    cy.visit("https://www.demoblaze.com/")
    cy.get('.card-title a').eq(getRandom()).click().then(($randomProduct1) => {
        addToCart();
        cy.get('#navbarExample .nav-item').eq(0).click() ///home

        cy.get('.card-title a').eq(getRandom()).click().then(($randomProduct2) => {
            addToCart()
            cy.get('#navbarExample .nav-item').eq(3).click() //cart

            cy.get('#tbodyid tr.success').should('contain.text', $randomProduct1.text())
            cy.get('#tbodyid tr.success').should('contain.text', $randomProduct2.text())

            cy.get('#totalp').then(($total)=>{
                cy.get('#tbodyid tr.success:nth-child(1) td:nth-child(3)').then(($valueProduct1)=>{
                    cy.get('#tbodyid tr.success:nth-child(2) td:nth-child(3)').then(($valueProduct2)=>{
                        expect(parseInt($total.text())).to.eq(parseInt($valueProduct1.text())+parseInt($valueProduct2.text())) 
                    })    
                })

                cy.get('.btn.btn-success').click() //purchase

                cy.fixture('user.json').then((userData)=>{

                    cy.get('#name').type(userData.name)
                    cy.get('#country').type(userData.country)
                    cy.get('#city').type(userData.city)
                    cy.get('#card').type(userData.creditCard)
                    cy.get('#month').type(userData.month)
                    cy.get('#year').type(userData.year)

                    cy.get('[onclick="purchaseOrder()"]').click()

                    cy.get('.sweet-alert h2').should('contain.text', 'Thank you for your purchase!')
                    cy.get('.sweet-alert p').should('contain.text', 'Amount: '+$total.text()+' USD')
                    cy.get('.sweet-alert p').should('contain.text', 'Card Number: '+userData.creditCard)
                    cy.get('.sweet-alert p').should('contain.text', 'Name: '+userData.name)
                })
            })
        })
    })
})