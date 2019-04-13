// Budget Controller
var budgetController = (function () {
    var x = 23;

    var add = function(a) {
        return x + a;
    }

    return {
        publicTest: function(b) {
            console.log(add(b));
        }
    }
})();


// UI Controller
var UIController = (function () {

});


// Global App Controller
var controller = (function(budgetCtrl, UIctrl) {

   document.querySelector('')

})(budgetController,UIController);