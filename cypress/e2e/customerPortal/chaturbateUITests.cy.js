/// <reference types="Cypress" />

const PublicHomePageChaturbate = () => {
    beforeEach(() => {
      // Code to be run before each individual `it` block
      System.visitHomePage();
      HomePage.closeAgreeToTermsModal();
    });

    describe("Chaturbate UI tests", () => {
      it("Verify room name and URL", () => {
        System.assertURL("chaturbate");

        HomePage.clickVideoAndVerifyURL();

        WebCamPage.assertSignUpButton();
        WebCamPage.assertScanNextButtons();
        WebCamPage.assertSendTipButton();
      });

      it("Verify main buttons on webcam page", () => {
        HomePage.clickRandomVideo();

        WebCamPage.assertSignUpButton();
        WebCamPage.assertScanNextButtons();
        WebCamPage.assertSendTipButton();
        WebCamPage.verifyVideoIsPlaying();
      });

      it("Verify Scan Cam Functionality", () => {
        HomePage.clickRandomVideo();

        WebCamPage.verifyScanCam();
        WebCamPage.verifyScanCam();
        WebCamPage.verifyScanCam();
      });
    });
  };

  export default PublicHomePageChaturbate;

  describe("public-homepage-chaturbate", function () {
    PublicHomePageChaturbate();
  });

  // --------------------------------------------------------------------

  class System {
    static visitHomePage() {
      cy.log("**visitHomePage()**");
      cy.visit("https://chaturbate.com/");
    }

    static assertURL(domain) {
      cy.log("**assertURL()**");
      const url = `https://${domain}.com/`;
      cy.url().should("eq", url);
    }
  }

  // -----------------------------------------
  class HomePage {
    // HomePage Functions
    static clickVideoAndVerifyURL() {
      cy.log("**clickVideoAndVerifyURL()**");
      this.getRandomVideo()
        .find(".title")
        .then(($el) => {
          cy.wrap($el)
            .find("a")
            .then((username) => {
              cy.wrap(username)
                .invoke("attr", "data-room")
                .then((usernameText) => {
                  cy.wrap($el).click();
                  cy.url().should("include", usernameText);
                });
            });
        });
    }

    static clickRandomVideo() {
      cy.log("**clickRandomVideo()**");
      this.getRandomVideo().click();
    }

    static verifyScanNextButtonsExist() {
      cy.log("**verifyScanNextButtonsExist()**");
      this.mainContentGetDemo().click();
    }

    static closeAgreeToTermsModal() {
      cy.log("**closeAgreeToTermsModal()**");
      this.getAgreeToTermsButton().click();
    }

    //HomePage Elements

    static getRandomVideo() {
      return cy.get(".room_list_room").eq(4);
    }

    static getAgreeToTermsButton() {
      return cy.get("#close_entrance_terms");
    }
  }

  // -----------------------------------------
  class WebCamPage {
    // WebCamPage Functions

    static assertSignUpButton() {
      cy.log("**assertSignUpButton()**");
      this.getSignUpButton().should("be.visible");
    }

    static assertScanNextButtons() {
      cy.log("**assertScanNextButtons()**");
      this.getScanNextCamButtons().should("be.visible");
    }

    static assertSendTipButton() {
      cy.log("**assertSendTipButton()**");
      this.getSendTipButton().should("be.visible");
    }

    static verifyVideoIsPlaying() {
      cy.log("**verifyVideoIsPlaying()**");
      this.getMainVideoElement()
        .find("video")
        .should(($video) => {
          expect($video.get(0)).to.have.property("paused", false);
        });
    }

    // Note: I was working to refine this but was running into some secuirty issues on the website
    // and was blocked running tests.
    static verifyScanCam() {
      cy.log("**verifyScanCam()**");
      cy.url().then((url) => {
        this.getScanCamButton().click();
        cy.url().should("not.contain", url);
      });
    }

    //WebCam Page Elements

    static getMainVideoElement() {
      return cy.get(".videoPlayerDiv");
    }

    static getSignUpButton() {
      return cy.get("#nav").find("a").contains("Sign up");
    }

    static getSendTipButton() {
      return cy.get(".sendTipButton");
    }

    static getScanNextCamButtons() {
      return cy.get('[data-paction="NextCam"]');
    }

    static getSignUpButton() {
      return cy.get("#nav").children().contains("Sign Up");
    }

    static getScanCamButton() {
      return cy.get('[data-paction="NextCam"]').find("a").eq(0);
    }
  }
