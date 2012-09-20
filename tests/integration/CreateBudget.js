var helper = require('./helper');
var should = require('should');
var async = require('async');
var browser;

async.forEachSeries(helper.config.browsers, function(browserEnv, suiteDone){

  describe('In ' + browserEnv.browserName + ' load the home page and clicking SAVE & SHARE', function(){

    before(function(done){
      helper.startBrowser('Create Budget', browserEnv, function(err, webdriver){
        browser = webdriver;
        browser.elementByCssSelector('a[href="/budget/save"]', function(err, el){
          should.exist(el);
          browser.clickElement(el, function(err){
            setTimeout(function(){ done(); }, 500);
          });
        });
      });
    });

    it("should display the 'Save your budget form' and focus on 'Your Name'", function(done){
      browser.active(function(err, input){
        if (err) return next(err);
        browser.getAttribute(input, 'name', function(err, value){
          value.should.equal('yourName');
          done();
        });
      });
    });

    describe('with the form filled out and save clicked', function(){

      var details = [
        ['yourName', 'B.J. Rossiter' ],
        ['yourState', 'NSW' ],
        ['yourEmail', 'bj.rossiter@theglobalmail.org' ],
        ['budgetDescription', 'testing!' ]
      ];

      var budgetUrlSel = 'input[name="budget-url"]';

      before(function(done){
        async.forEachSeries(details, function(detail, next){
          helper.inputText(browser, detail[0], detail[1], next);
        }, function(err){
          should.not.exist(err);
          helper.click(browser, 'submit-save-budget', function(err){ 
            browser.waitForConditionInBrowser("$('" + budgetUrlSel + ":visible').length > 0", 3000, 100, function(err, met){
              done();
            });
          });
        });
      });

      it('should display a link to share', function(done){
        browser.elementByCssSelector(budgetUrlSel, function(err, el){
          el.getValue(function(err, text){
            console.log("got text: " + text);
            text.should.match(/^http:.*\/budget\/\S+/);
            text.should.not.match(/undefined/);
            done();
          });
        });
      });

    });

    after(function(done){
      browser.quit(done);
      suiteDone();
    });
  });

});
