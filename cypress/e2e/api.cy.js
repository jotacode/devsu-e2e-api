/// <reference types="cypress"/>

it("Create a new user in demoblaze", () => {
  const faker = require("faker");
    cy.request({
      method: 'POST',
      url: "/signup",
      headers:{
        'Content-type': 'application/json'
      },
      body: {
        'username': faker.internet.email(),
        'password': faker.internet.password()
      }
    
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.empty
    })
  })

  it("Try to create an existing user", () => {
    cy.request({
      method: 'POST',
      url: "/signup",
      headers:{
        'Content-type': 'application/json'
      },
      body: {
        'username': '123',
        'password': '123'
      }
    
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.errorMessage).to.eq('This user already exist.')
    })
  })

  it("Login with valid username and password", () => {
    cy.request({
      method: 'POST',
      url: '/login',
      headers: {
        'Content-type': 'application/json'
      },
      body: {
        'username': '123',
        'password': 'MTIz'
      }
    }).then((response)=>{
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('Auth_token')
    })
  })

  it("Login with valid username and wrong password", () => {
    cy.request({
      method: 'POST',
      url: '/login',
      headers: {
        'Content-type': 'application/json'
      },
      body: {
        'username': '123',
        'password': '1'
      }
    }).then((response)=>{
      expect(response.status).to.eq(200)
      expect(response.body.errorMessage).to.eq('Wrong password.')
    })
  })