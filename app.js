// Budget Controller
var budgetController = (function () {
// if we want to make many objects
    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) { // type is in square brackets because the value retrieved is a string
            var newItem, ID;
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // selecting the last element
            } else {
                ID = 0;
            }

            //  Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense (ID , des , val);
            } else if (type === 'inc') {
                newItem = new Income (ID , des , val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        calculateBudget: function() {
            

        },

        testing: function () {
            console.log(data);
        }
    };


})();


// UI Controller
var UIController = (function () {

    var DOMstrings = { //This is so that its easier to change class names
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return { // returns so outside scope has acccess to the method
        getInput : function () { // This is a function so the information inside gets updated with inputs / Variables changing
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // Create HTML strings with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>';
            }
           
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); // returns an object node list
            fieldsArr = Array.prototype.slice.call(fields); // returns an array from an object list 
            // slice method returns an array and call method redirect the function slice towards fields  object list.
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });
            console.log(fieldsArr)
            fieldsArr[0].focus();

        },

        getDOMstrings : function () {
            return DOMstrings;
        }
    };
})();


// Global App Controller
var controller = (function(budgetCtrl, UIctrl) {

    var setupEventListeners = function () {
        var DOM = UIctrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
             if (event.keyCode === 13 || event.which === 13) {
                 ctrlAddItem();
             }
        });
    };

    var updateBudget = function () {
               // 1. Calculate the budget

            //    2. Return the budget

               // 3. Display the budget on the UI.
    }

    var ctrlAddItem = function () {
        var input, newItem;
       // 1. Get the field input data
        input = UIctrl.getInput();
       if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // FIXED EMPTY INPUTS

       // 2. Add the item to the budget controller.
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);

       // 3. Add item to the UI.
       UIctrl.addListItem(newItem, input.type);
       
       // 4. Clear the fields
       UIctrl.clearFields();

    //    5. Calculate and Update the Budget.
        updateBudget();

       }

    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();

        }
    };
    



})(budgetController,UIController);

controller.init();