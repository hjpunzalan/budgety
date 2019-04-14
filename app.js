// Budget Controller
var budgetController = (function () {
// if we want to make many objects
    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0; // We added the sum variable so that when this function runs, it resets and calculates new one. It doesnt carry over the previous sum which output an incorrect total when expenses and income mixes.
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
        
    }

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

        deleteItem: function (type, id) {
            var ids, index;
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4 6 8]
            // index = 3
            // ids are now part of an object inside an array
            // we now place the ids from each object into a separate array so we can manipulate it
             ids = data.allItems[type].map(function(current) {
                    return current.id;
             });

             index = ids.indexOf(id);
             console.log(index);
             if (index !== -1) {
                data.allItems[type].splice(index, 1);
             }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            //  a= 20
            //  b= 10
            // c= 40
            //  income = 100
            // a = 20/100 = 20%
            // b = 10/100 = 10% etc...

            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPercentages;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
            
        },

        testing: function () {
            console.log(data);
        }
    };


})();


//  ----------------------- UI Controller ----------------------------
var UIController = (function () {

    var DOMstrings = { //This is so that its easier to change class names
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="ios-close-circle-outline"></ion-icon></button></div></div></div>';
            }
           
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); // returns an object node list
            fieldsArr = Array.prototype.slice.call(fields); // returns an array from an object list 
            // slice method returns an array and call method redirect the function slice towards fields  object list.
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });
            fieldsArr[0].focus();

        },

        displayBudget: function(obj) { //passing the budget object values
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) { // when there's more expense than income
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }


        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            fields.forEach(function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        formatNumber: function (num, type) {
                /*
                + or - before number
                exactly 2 decimal points
                comma separating the thousands

                2310.4567 -> + 2,310.46
                2000 -> + 2,000.00
                */

            num = Math.abs(num);
        },

        getDOMstrings : function () {
            return DOMstrings;
        }
    };
})();


//---------------------------------Global App Controller------------------------------------------------
var controller = (function(budgetCtrl, UIctrl) {

    var setupEventListeners = function () {
        // DOMSTRINGS OBJECT
        var DOM = UIctrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
             if (event.keyCode === 13 || event.which === 13) {
                 ctrlAddItem();
             }
        });
        // adding ctrl delete item
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function () {
               // 1. Calculate the budget
               budgetCtrl.calculateBudget();

                 //   2. Return the budget
                var budget = budgetCtrl.getBudget();
                
               // 3. Display the budget on the UI.
               UIctrl.displayBudget(budget);
    }

    var updatePercentages = function () {
        // 1 . Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages.
        UIctrl.displayPercentages(percentages);
    };

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
        
        // 6. Calculate and update percentages. 
        updatePercentages();

       }

    };

    var ctrlDeleteItem = function (event) { // event.target.parentNode moves up into parent element
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // returns a string

        if (itemID) {
            // inc-1
            // split breaks objects or primitives into an array list
            splitID = itemID.split('-'); // this will be an array format ["type", "ID#"]
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete item from UI
            UIctrl.deleteListItem(itemID);

            // 3. Update and show the new budget.
            updateBudget();

            // 4. Calculate and update percentages.
            updatePercentages();

        }

    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

        }
    };
    



})(budgetController,UIController);

controller.init();