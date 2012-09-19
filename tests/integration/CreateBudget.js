var helper = require('./helper');
var should = require('should');
var async = require('async');
var browser;

describe('Loading the home page and clicking SAVE & SHARE', function(){

  before(function(done){
    helper.startBrowser(function(err, webdriver){
      browser = webdriver;
      browser.elementByCssSelector('a[href="/budget/save"]', function(err, el){
        should.exist(el);
        browser.clickElement(el, function(err){
          setTimeout(function(){ done(); }, 500);
        });
      });
    });
  });

  it("should display the 'Save your budget form'", function(done){
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
          browser.waitForConditionInBrowser("$('" + budgetUrlSel + "').length", function(err, met){
            done();
          });
        });
      });
    });

    it('should display a link to share', function(done){
      browser.elementByCssSelector(budgetUrlSel, function(err, el){
        el.text(function(err, text){
          text.should.match(/^http:.*\/budget\/\S+/);
          done();
        });
      });
    });

  });

  after(function(done){
    browser.quit(done);
  });
});
