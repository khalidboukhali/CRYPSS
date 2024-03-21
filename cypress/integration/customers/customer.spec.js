function addCustomer(firstName, lastName, postalCode) {
  cy.visit(
    "https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust"
  );

  cy.get(":nth-child(1) > .form-control").type(firstName);
  cy.get(":nth-child(2) > .form-control").type(lastName);
  cy.get(":nth-child(3) > .form-control").type(postalCode);

  cy.get("form.ng-dirty > .btn").click();

  // Utiliser cy.on() pour intercepter l'événement d'alerte
  cy.on("window:alert", (alertText) => {
    expect(alertText).to.include(
      "Customer added successfully with customer id :6"
    );
  });
}

function openAccount(firstName, lastName) {
  // open account
  cy.visit(
    "https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount"
  );
  cy.get("#userSelect").select(`${firstName} ${lastName}`);
  cy.get("#currency").select("Dollar");
  cy.get("form.ng-dirty > button").click();
  cy.on("window:alert", (alertText) => {
    expect(alertText).to.include(
      "Account created successfully with account Number :1016"
    );
  });
}

function loginClientSuccessfully() {
  // first add customer
  addCustomer("khalid", "boukhali", 80000);
  // second open account
  openAccount("khalid", "boukhali");
  cy.visit(
    "https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login"
  );

  cy.get(".borderM > :nth-child(1) > .btn").click();

  cy.get("#userSelect").select("khalid boukhali");

  cy.get("form.ng-valid > .btn").click();
}

function diposit(amount) {
  // first login
  loginClientSuccessfully();

  cy.get('[ng-class="btnClass2"]').click();

  let balanceValue;
  cy.get(".borderM > :nth-child(3)")
    .contains(/^Account Number : \d+/)
    .invoke("text")
    .then((text) => {
      const balanceMatch = text.match(/Balance : (\d+)/);

      if (balanceMatch) {
        balanceValue = parseInt(balanceMatch[1], 10);
      }
    });

  cy.get(".form-control").type(amount);

  cy.get("form.ng-dirty > .btn").click();

  cy.get(".error").contains("Deposit Successful").should("exist");

  let currentBalanceValue;
  cy.get(".borderM > :nth-child(3)")
    .contains(/^Account Number : \d+/)
    .invoke("text")
    .then((text) => {
      const balanceMatch = text.match(/Balance : (\d+)/);
      if (balanceMatch) {
        currentBalanceValue = parseInt(balanceMatch[1], 10);
        // verify current balance equals previous balance + the amount passed
        expect(currentBalanceValue).to.equal(balanceValue + amount);
      }
    });
}

function drawn(amount) {
  //  adding some amount
  diposit(20);

  cy.get('[ng-class="btnClass3"]').click();
  let balanceValue;
  cy.get(".borderM > :nth-child(3)")
    .contains(/^Account Number : \d+/)
    .invoke("text")
    .then((text) => {
      const balanceMatch = text.match(/Balance : (\d+)/);

      if (balanceMatch) {
        balanceValue = parseInt(balanceMatch[1], 10);
      }
    });

  cy.get(".form-control").type(amount);

  cy.get("form.ng-pristine > .btn").click();

  cy.get(".form-control").type(amount);

  cy.get("form.ng-dirty > .btn").click();

  cy.get(".error").contains("Transaction successful").should("exist");

  let currentBalanceValue;
  cy.get(".borderM > :nth-child(3)")
    .contains(/^Account Number : \d+/)
    .invoke("text")
    .then((text) => {
      const balanceMatch = text.match(/Balance : (\d+)/);
      if (balanceMatch) {
        currentBalanceValue = parseInt(balanceMatch[1], 10);
        // verify current balance equals previous balance - the amount passed
        expect(currentBalanceValue).to.equal(balanceValue - amount);
      }
    });
}

describe("Test de drawn un amount", () => {
  it("Drawn un amount avec succès", () => {
    drawn(10);
  });
});
