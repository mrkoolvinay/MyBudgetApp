var budgetController = (function() {
    // Budget Controller.
    var Expense = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    }

    var Income = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    }

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
        expenseContainer: '.expenses__list'
    };

    return {
        getInput: function () {
            return {
                // Will be either inc or exp
                type: document.querySelector(DOMStrings.input_type).value,
                description: document.querySelector(DOMStrings.input_desc).value,
                value: document.querySelector(DOMStrings.input_value).value,
            }
        },

        addListItem: function(obj, type) {
            // Create HTML string with placeholder
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">'
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
                html = '<div class="item clearfix" id="expense-0">'
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
            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.val);

            // Insert HTML
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
    };

    var ctrlAddItem = function() {
        var input, newItem;

        // 1. Get the field input data
        input = uiCtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgtCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the item to the UI and clear the fields
        uiCtrl.addListItem(newItem, input.type);
        uiCtrl.clearFields();

        // 4. Calculate the budget
        // 5. Display the budget
    };


    return {
        init: function() {
            console.log('Application started');
            setupEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();