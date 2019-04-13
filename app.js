// Budget Controller
var budgetController = (function () {





})();


// UI Controller
var UIController = (function () {

    var DOMstrings = { //This is so that its easier to change class names
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }

    return { // returns so outside scope has acccess to the method
        getInput : function () { // This is a function so the information inside gets updated with inputs
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings : function () {
            return DOMstrings;
        }
    };
})();


// Global App Controller
var controller = (function(budgetCtrl, UIctrl) {


    var DOM = UIctrl.getDOMstrings();

    var ctrlAddItem = function () {
       // 1. Get the field input data
        var input = UIctrl.getInput();
        console.log(input);
       // 2. Add the item to the budget controller.
       // 3. Add item to the UI.
       // 4. Calculate the budget
       // 5. Display the budget on the UI.
    }
    
   document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

   document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
   })



})(budgetController,UIController);