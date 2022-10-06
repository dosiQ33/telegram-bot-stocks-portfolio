var homeBoard = {
    "inline_keyboard": [
        [{
            "text": "Download",
            'callback_data': 'Download'
        }, {
            "text": "Mailing",
            'callback_data': 'Mailing'
        }],
        [{
            "text": "Buy",
            'callback_data': 'Buy'
        }, {
            "text": "Sell",
            'callback_data': 'Sell'
        }],
        [{
            "text": "Cash In",
            'callback_data': 'Cash In'
        }, {
            "text": "Cash Out",
            'callback_data': 'Cash Out'
        }],
        [{
            "text": "Add Symbol",
            'callback_data': 'addSymbol'
        }, {
            "text": "Add Person",
            'callback_data': 'newPerson'
        }, {
            "text": "Price Target",
            'callback_data': 'PriceTarget'
        }]
    ]
};

var delete_keyboard = {
    "remove_keyboard": true
};

// ---- holders keyboard

function porfolioHolders_function(k) {
    var porfolioHolders = [];
    var names = logins_sheet.getRange(2, 2, logins_sheet.getLastRow()).getValues();

    var from = 10 * (k - 1);
    var to = 10 * k;
    if ((logins_sheet.getLastRow() - 1) < to) {
        var to = (logins_sheet.getLastRow() - 1);
    }
    for (var i = from; i < to; i++) {
        porfolioHolders.push([{
            'text': names[i][0],
            'callback_data': names[i][0]
        }]);
    }
    if ((k == 1) && ((logins_sheet.getLastRow() - 1) > to)) {
        porfolioHolders.push([{
            'text': '⏺',
            'callback_data': 'donothing'
        }, {
            'text': '🏠',
            'callback_data': 'home'
        }, {
            'text': '⏩',
            'callback_data': 'next'
        }]);
    } else if ((k == 1) && ((logins_sheet.getLastRow() - 1) <= to)) {
        porfolioHolders.push([{
            'text': '⏺',
            'callback_data': 'donothing'
        }, {
            'text': '🏠',
            'callback_data': 'home'
        }, {
            'text': '⏺',
            'callback_data': 'donothing'
        }]);
    } else if ((k != 1) && ((logins_sheet.getLastRow() - 1) <= to)) {
        porfolioHolders.push([{
            'text': '⏪',
            'callback_data': 'prev'
        }, {
            'text': '🏠',
            'callback_data': 'home'
        }, {
            'text': '⏺',
            'callback_data': 'donothing'
        }]);
    } else if ((k != 1) && ((logins_sheet.getLastRow() - 1) > to)) {
        porfolioHolders.push([{
            'text': '⏪',
            'callback_data': 'prev'
        }, {
            'text': '🏠',
            'callback_data': 'home'
        }, {
            'text': '⏩',
            'callback_data': 'next'
        }]);
    }
    var porfolioHoldersKeyboard = {
        "inline_keyboard": porfolioHolders
    };
    return porfolioHoldersKeyboard;
}
