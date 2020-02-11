var budgetController = (function() {
    // Budget Controller.
    var Expense = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
        this.percentage = -1;
    };

    Expense.prototype.calPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.val / totalIncome) * 100);
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
        this.percentage = -1;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum = sum + current.val;
        });

        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, value) {
            var newItem, ID;
            const newLocal = data.allItems[type];
            // Create new ID
            if (newLocal.length > 0) {
                ID = newLocal[newLocal.length - 1].id + 1;
            } else {
                ID = 1;
            }
            

            // Create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, value);
            }

            // Push it into our DS
            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id) {
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate te budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(curr) {
                curr.calPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            return data.allItems.exp.map(function(curr){
                return curr.getPercentage();
            });
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };
})();


var uiController = (function () {
    // UI Controller

    var DOMStrings = {
        input_type: '.add__type',
        input_desc: '.add__description',
        input_value: '.add__value', 
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };

    
    formatNumber = function(num, type) {
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];
        type === 'exp' ? sign = '-' : sign = '+';

        return sign + ' ' + int + '.' + dec

    };

    return {
        getInput: function () {
            return {
                // Will be either inc or exp
                type: document.querySelector(DOMStrings.input_type).value,
                description: document.querySelector(DOMStrings.input_desc).value,
                value: parseFloat(document.querySelector(DOMStrings.input_value).value),
            }
        },

        addListItem: function(obj, type) {
            // Create HTML string with placeholder
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">'
                + '<div class="item__description">%description%</div>'
                + '<div class="right clearfix">'
                + '<div class="item__value">%value%</div>'
                + '<div class="item__delete">'
                + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'
                + '</div>'
                + '</div>'
                + '</div>'
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%">'
                + '<div class="item__description">%description%</div>'
                + '<div class="right clearfix">'
                + '<div class="item__value">%value%</div>'
                + '<div class="item__percentage">21%</div>'
                + '<div class="item__delete">'
                + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>'
                + '</div>'
                + '</div>'
                + '</div>'
            }
            // Replace the placeholder
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.val));

            // Insert HTML
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorId) {
            var el = document.getElementById(selectorId)
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.input_desc + ', ' 
                                + DOMStrings.input_value);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage >  0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            var nodeListForEach = function(list, callback) {
                for (var i=0; i<list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '--';
                }
            });
        },

        displayMonth: function() {
            var now, year;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        getDomStrings: function() {
            return DOMStrings;
        }
    }

})();


var controller = (function(budgtCtrl, uiCtrl) {
    // Global App Controller

    var setupEventListeners = function () {
        var dom = uiCtrl.getDomStrings();
        document.querySelector(dom.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {

        // Calculate the budget
        budgtCtrl.calculateBudget();

        // return the budget
        var budget = budgtCtrl.getBudget();

        // Display the budget in the UI
        uiCtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calculate the percentages
        budgtCtrl.calculatePercentages();

        // Read percentages from budget controller
        var percentages = budgtCtrl.getPercentages();

        // Update the UI with the new percentages
        uiCtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = uiCtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgtCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI and clear the fields
            uiCtrl.addListItem(newItem, input.type);
            uiCtrl.clearFields();

            // 4. Calculate and update budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemId, splitId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            // Delete the item from the data structure
            budgtCtrl.deleteItem(type, id);

            // Delete the item from the UI
            uiCtrl.deleteListItem(itemId);

            // Update and show the new budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application started');
            uiCtrl.displayMonth();
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();