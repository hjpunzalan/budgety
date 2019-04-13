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



var UIController = (function () {

});



var controller = (function(budgetCtrl, UIctrl) {

    var z = budgetCtrl.publicTest(5);

})(budgetController,UIController);