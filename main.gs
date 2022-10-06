var token = "1422055409:AAHJTxbOFsUfShverzaZOG0-----------";
var telegramAppUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbzA4vqLCykrw6Y-M24bRHNetWc-----------k4f_xOyAaTu_H/exec";
var sheetId = "1oQAJQD-vzajTPaatV6sX1nPv-----------1BRdNZSU";
var logins_sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Logins");
var prices_sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Prices");
var technical_sheet = SpreadsheetApp.openById(sheetId).getSheetByName("technical sheet");
var transactions_sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Transactions");
var allowed_telegram_id_list = logins_sheet.getRange(2, 3, logins_sheet.getLastRow()).getValues().toString(); // in case of if add .split(",") to get list

function setWebhook() {
    var url = telegramAppUrl + "/setWebhook?url=" + webAppUrl;
    var response = UrlFetchApp.fetch(url);
//    Logger.log(DriveApp.getFileById('0B7XCNYQ-----------DbW8').getSize());
}

function sendMessage(chatId, text, keyBoard) {
    var data = {
        method: "post",
        payload: {
            method: "sendMessage",
            chat_id: String(chatId),
            text: text,
            reply_markup: JSON.stringify(keyBoard)
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function currentAction(id) {
    if (((technical_sheet.getRange(2, 2).getValue() == 'Buy') || (technical_sheet.getRange(2, 2).getValue() == 'Sell')) && (id == technical_sheet.getRange(2, 3).getValue())) {
        sendMessage(id, 'Please, enter stock symbol' + '\n' + 'ex.: AAPL or aapl or Aapl' + '\n' + 'for IPO: Aapl ipo or aapl ipo');
    } else if (((technical_sheet.getRange(2, 2).getValue() == 'Cash In')) && (id == technical_sheet.getRange(2, 3).getValue())) {
        sendMessage(id, 'Please, enter cash in sum and commission sum' + '\n' + 'ex.: 3000 25 or 1550 15.5');
    } else if (((technical_sheet.getRange(2, 2).getValue() == 'Cash Out')) && (id == technical_sheet.getRange(2, 3).getValue())) {
        sendMessage(id, 'Please, enter cash out sum' + '\n' + 'ex.: 3000 or 15000');
    } else if (((technical_sheet.getRange(2, 2).getValue() == 'Download')) && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null)) {
        sendChatAction(id);
        sendDocument(id, sheetToPDF(SpreadsheetApp.openById(sheetId).getSheetByName(technical_sheet.getRange(2, 4).getValue()), technical_sheet.getRange(2, 4).getValue().toString()));
        resetToHomeboard();
        sendMessage(id, 'choose an action to do', homeBoard);
    }
}


function doPost(e) {
    var contents = JSON.parse(e.postData.contents);
    var dateNow = new Date;
    var reformatedDate = dateNow.getDate() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getFullYear() + ' ' + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();
    if (contents.callback_query) {
        var chat_id = contents.callback_query.message.chat.id;
        var from_id = contents.callback_query.from.id;
        var message_id = contents.callback_query.message.message_id;
        var data = contents.callback_query.data;
        var k = technical_sheet.getRange(2, 1).getValue();
        if ((data == 'Buy') || (data == 'Cash In') || (data == 'Cash Out') || (data == 'Sell')) {
            technical_sheet.getRange(2, 1).setValue(1);
            technical_sheet.getRange(2, 2).setValue(data);
            technical_sheet.getRange(2, 3).setValue(chat_id);
            editReply(chat_id, message_id, porfolioHolders_function(k));
        } else if (data == 'Download') {
            sendChatAction(chat_id);
            sendDocument(chat_id,sheetToXlsx());
        } else if (data == 'home') {
            resetToHomeboard();
            editReply(chat_id, message_id, homeBoard);
        } else if (data == 'donothing') {
            editReply(chat_id, message_id, porfolioHolders_function(k));
        } else if (data == 'next') {
            k++;
            technical_sheet.getRange(2, 1).setValue(k);
            editReply(chat_id, message_id, porfolioHolders_function(k));
        } else if (data == 'prev') {
            k--;
            technical_sheet.getRange(2, 1).setValue(k);
            editReply(chat_id, message_id, porfolioHolders_function(k));
        } else if (data == 'newPerson') {
            technical_sheet.getRange(2, 2).setValue(data);
            technical_sheet.getRange(2, 3).setValue(chat_id);
            deleteMsg(chat_id, message_id);
            sendMessage(chat_id, 'Enter phone number and name' + '\n' + 'ex.: 77073032200-Aidos');
        } else if (data == 'Mailing') {
            technical_sheet.getRange(2, 2).setValue(data);
            technical_sheet.getRange(2, 3).setValue(chat_id);
            deleteMsg(chat_id, message_id);
            sendMessage(chat_id, '🗣 Send message to bot users:');
        } else if (logins_sheet.getRange(2, 2, logins_sheet.getLastRow()).getValues().toString().split(",").includes(data.toString())) {
            technical_sheet.getRange(2, 4).setValue(data);
            deleteMsg(chat_id, message_id);
            currentAction(chat_id);
        } else if (data == 'addSymbol') {
            sendMessage(chat_id, 'Please, enter stock symbol' + '\n' + 'ex.: AAPL or aapl or Aapl' + '\n' + 'send /home to get back to the homepage');
            technical_sheet.getRange(2, 2).setValue(data);
            technical_sheet.getRange(2, 3).setValue(chat_id);
            deleteMsg(chat_id, message_id);
        } else if (data == 'PriceTarget') {
            sendMessage(chat_id, 'Please, enter stock symbol and price target' + '\n' + 'ex.:aapl 175 or Aapl 175' + '\n' + 'send /home to get back to the homepage');
            technical_sheet.getRange(2, 2).setValue(data);
            technical_sheet.getRange(2, 3).setValue(chat_id);
            deleteMsg(chat_id, message_id);
        }
    } else if (contents.message) {
        var id = contents.message.from.id;
        var text = contents.message.text;
        var login_return = loginToTheBot(contents);
        try {
            var name = SpreadsheetApp.openById(sheetId).getSheetByName(technical_sheet.getRange(2, 4).getValue());
            var row_number = name.getRange(2, 1, name.getLastRow()).getValues().toString().split(",").indexOf(technical_sheet.getRange(2, 7).getValue().toString());
        } catch (err) {}
        if ((technical_sheet.getRange(2, 2).getValue() == 'newPerson') && (id == technical_sheet.getRange(2, 3).getValue())) {
            if ((text.split('-')[0].trim().length == 11) && (text.split('-')[1].trim() != null)) {
                if (logins_sheet.getRange(2, 1, logins_sheet.getLastRow()).getValues().toString().split(",").includes(text.split('-')[0].toString().trim())) {
                    sendMessage(id, '🚫 This phone number already exists in the list');
                } else if (logins_sheet.getRange(2, 2, logins_sheet.getLastRow()).getValues().toString().toUpperCase().split(",").includes(text.split('-')[1].toString().toUpperCase().trim())) {
                    sendMessage(id, '🚫 This name already exists in the list');
                } else if ((!logins_sheet.getRange(2, 1, logins_sheet.getLastRow()).getValues().toString().split(",").includes(text.split('-')[0].toString().trim())) && (!logins_sheet.getRange(2, 2, logins_sheet.getLastRow()).getValues().toString().split(",").includes(text.split('-')[1].toString().trim()))) {
                    logins_sheet.appendRow([text.split('-')[0].trim(), text.split('-')[1].trim(), , 'user'])
                    logins_sheet.getRange(2, 1, logins_sheet.getLastRow(), 4).sort(2)
                    resetToHomeboard();
                    sendChatActionTyping(id);
                    SpreadsheetApp.openById(sheetId).insertSheet(text.split('-')[1].trim(), 100);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42, 1, 1, 9).setValues([
                        ['SYMBOL', 'SHARES', 'PRICE1', 'COST', 'GAIN', 'PRICE2', 'VALUE','LOCK UP TILL','PRICE TARGET']
                    ]);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42, 1, 1, 9).setFontWeights([
                        ["bold", "bold", "bold", "bold", "bold", "bold", "bold", "bold", "bold"]
                    ]);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42, 1, 1, 9).setBorder(false, false, true, false, false, false);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(17, 4).setValue('Cash In sum').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(18, 4).setValue('Cash Out sum').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(17, 1).setValue('Portfolio sum').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(17, 2).setValue('=SUM(G42:G)');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(18, 1).setValue('IPO sum').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(18, 2).setValue('=SUM(FILTER(G42:G, REGEXMATCH(A42:A," IPO")))');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(19, 1).setValue('Secondary sum').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(19, 2).setValue('=B17-B18');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(20, 1).setValue('Free Cash').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(21, 1).setValue('Total').setFontWeight('bold');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(21, 2).setValue('=B17+B20');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).insertImage(DriveApp.getFileById('1wpYJOD1PPFyURJAH_xv4-OlWDfmHTmfN').getBlob(), 1, 1).setWidth(150).setHeight(150);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).insertImage(DriveApp.getFileById('1i9VpAjLCJ8lCzWOQr3Hjb7Q-E-DuKAu-').getBlob(), 8, 4).setWidth(200).setHeight(100);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(8, 5).setValue('FINLION MANAGEMENT').setFontWeight('bold').setHorizontalAlignment("center");;
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(13, 1).setValue('Portfolio holder: '+text.split('-')[1].trim());
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(1, 8).setValue('Tel.:').setHorizontalAlignment("right");
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(1, 9).setValue('-');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(2, 9).setValue('info@finlm.com');
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(3, 9).setValue('www.finlm.com');
                    sendChatActionTyping(id);
                    var pieChartBuilder = SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).newChart()
                        .addRange(SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42, 1, 1000, 1))
                        .addRange(SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42, 7, 1000, 1))
                        .setChartType(Charts.ChartType.PIE)
                        .setOption('pieSliceText', 'value')
                        .setPosition(24, 6, 0, 0)
                        .setOption('width', 400).setOption('height', 290)
                        .build();
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).insertChart(pieChartBuilder);
                    
                    var pieChartBuilderIpo = SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).newChart()
                        .addRange(SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(18, 1, 3, 2))
                        .setChartType(Charts.ChartType.PIE)
                        .setOption('pieSliceText', 'value')
                        .setPosition(24, 1, 0, 0)
                        .setOption('width', 400).setOption('height', 290)
                        .build();
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).insertChart(pieChartBuilderIpo);
                    sendChatActionTyping(id);
                    SpreadsheetApp.openById(sheetId).getSheetByName(text.split('-')[1].trim()).getRange(42,1, 1000, 9).setHorizontalAlignment("left");
                    sendMessage(id, '✅ Person has been added');
                    sendMessage(id, 'choose an action to do', homeBoard);
                }
            } else {
                sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
            }
        } else if ((technical_sheet.getRange(2, 2).getValue() == 'addSymbol') && (id == technical_sheet.getRange(2, 3).getValue())) {
            if (prices_sheet.getRange(2, 1, prices_sheet.getLastRow()).getValues().toString().split(",").includes(text.toString().toUpperCase())) {
                sendMessage(id, '🚫 This stock symbol already exists in the list ' + text.toString().toUpperCase());
            } else {
                prices_sheet.appendRow([text.toString().toUpperCase(), '=GOOGLEFINANCE("' + text.toString().toUpperCase() + '","name")', '=GOOGLEFINANCE("' + text.toString().toUpperCase() + '","price")']);
                sendMessage(id, '✅ ' + text.toString().toUpperCase() + ': ' + prices_sheet.getRange(prices_sheet.getLastRow(), 2).getValue() + ' - has been added');
            }
        } else if ((technical_sheet.getRange(2, 2).getValue() == 'PriceTarget') && (id == technical_sheet.getRange(2, 3).getValue())) {
            if (prices_sheet.getRange(2, 1, prices_sheet.getLastRow()).getValues().toString().split(",").includes(text.split(' ')[0].trim().toString().toUpperCase())) {
                prices_sheet.getRange(prices_sheet.getRange(2, 1, prices_sheet.getLastRow()).getValues().toString().split(",").indexOf(text.split(' ')[0].trim().toString().toUpperCase())+2, 5).setValue(text.split(' ')[1].trim().toString()+'$')
                sendMessage(id, '✅'+ '\n' + 'send /home to get back to the homepage');
            } else {
                sendMessage(id, '🚫 This stock does not exists');
            }
        } else if ((technical_sheet.getRange(2, 2).getValue() == 'Mailing') && (id == technical_sheet.getRange(2, 3).getValue())) {
            try { if (contents.message.text){
               for (var i = 0; i < allowed_telegram_id_list.split(",").length;i++){
                  try{sendMessage(allowed_telegram_id_list.split(",")[i], text);}catch(passerr){}
               }
            }} catch (err) {}
            try { if (contents.message.document){
                for (var i = 0; i < allowed_telegram_id_list.split(",").length;i++){
                  try{sendDocument(allowed_telegram_id_list.split(",")[i], contents.message.document.file_id);}catch(passerr){}
               }
            }} catch (err) {}
            try { if (contents.message.photo){
                for (var i = 0; i < allowed_telegram_id_list.split(",").length;i++){
                  try{sendPhoto(allowed_telegram_id_list.split(",")[i], contents.message.photo[2].file_id);}catch(passerr){}
               }
            }} catch (err) {}
            
        } else if ((technical_sheet.getRange(2, 2).getValue() == 'Cash In') && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null)) {
            if ((text.split(' ')[0] >= 0) && (text.split(' ')[1] >= 0)) {
                sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' +' + (text.split(' ')[0] - text.split(' ')[1]) + '💵');
                transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), '-', '-', text.split(' ')[0], 'Cash In', '-', text.split(' ')[1], (text.split(' ')[0] - text.split(' ')[1])]);
                name.getRange(17, 5).setValue('=' + name.getRange(17, 5).getValue() + '+' + (text.split(' ')[0] - text.split(' ')[1]));
                name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '+' + (text.split(' ')[0] - text.split(' ')[1]));
                resetToHomeboard();
                sendMessage(id, 'choose an action to do', homeBoard);
            } else {
                sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
            }
        } else if ((technical_sheet.getRange(2, 2).getValue() == 'Cash Out') && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null)) {
            if ((text >= 0)) {
                sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' -' + text + '💵');
                transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), '-', '-', text, 'Cash Out', '-', '-', (text)]);
                name.getRange(18, 5).setValue('=' + name.getRange(18, 5).getValue() + '+' + text);
                name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '-' + text);
                resetToHomeboard();
                sendMessage(id, 'choose an action to do', homeBoard);
            } else {
                sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
            }
        } else if (((technical_sheet.getRange(2, 2).getValue() == 'Buy')) && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null) && (technical_sheet.getRange(2, 5).getValue() == '')) {
            if (prices_sheet.getRange(2, 1, prices_sheet.getLastRow()).getValues().toString().split(",").includes(text.split(' ')[0].toString().toUpperCase())) {

                if (text.split(' ').length > 1) {
                    if ((text.split(' ')[1].toString().toUpperCase() == 'IPO')) {
                        technical_sheet.getRange(2, 5).setValue(text.split(' ')[0].toString().toUpperCase());
                        technical_sheet.getRange(2, 6).setValue(text.split(' ')[1].toString().toUpperCase());
                        technical_sheet.getRange(2, 7).setValue(text.toString().toUpperCase());
                        sendMessage(id, technical_sheet.getRange(2, 4).getValue() + ' wants to buy ' + text.toString().toUpperCase() + '\n' + 'please enter number of shares, price and commission' + '\n' + 'ex.:15 26 7.2');
                    } else {
                        sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
                        technical_sheet.getRange(2, 5).setValue('');
                        technical_sheet.getRange(2, 6).setValue('');
                        technical_sheet.getRange(2, 7).setValue('');
                    }
                } else {
                    technical_sheet.getRange(2, 5).setValue(text.split(' ')[0].toString().toUpperCase());
                    technical_sheet.getRange(2, 7).setValue(text.toString().toUpperCase());
                    sendMessage(id, technical_sheet.getRange(2, 4).getValue() + ' wants to buy ' + text.toString().toUpperCase() + '\n' + 'please enter number of shares, price and commission' + '\n' + 'ex.:15 26 7.2');
                }
            } else {
                sendMessage(id, '🚫 There is no that symbol in the list, first add this symbol at the /home page');
            }
        } else if (((technical_sheet.getRange(2, 2).getValue() == 'Buy')) && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null) && (technical_sheet.getRange(2, 5).getValue() != '')) {
            if ((text.split(' ')[0] >= 0) && (text.split(' ')[1] >= 0) && (text.split(' ')[2] >= 0)) {
                if (row_number == -1) {
                    var last_row = (name.getLastRow() + 1);
                    name.appendRow([technical_sheet.getRange(2, 7).getValue(), text.split(' ')[0], text.split(' ')[1], '=B' + last_row + '*' + 'C' + last_row, '=(F' + last_row + '-' + 'C' + last_row + ')*B' + last_row, '=INDEX(Prices!C:C,MATCH(index(split(A' + last_row + '," "),0,1),Prices!A:A,0))', '=F' + last_row + '*' + 'B' + last_row, '=INDEX(Prices!D:D,MATCH(index(split(A' + last_row + '," "),0,1),Prices!A:A,0))', '=INDEX(Prices!E:E,MATCH(index(split(A' + last_row + '," "),0,1),Prices!A:A,0))']);
                    sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' bought ' + text.split(' ')[0] + ' shares of ' + technical_sheet.getRange(2, 7).getValue() + ' at $' + text.split(' ')[1] + ' per share with commision $' + text.split(' ')[2]);
                    transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), technical_sheet.getRange(2, 7).getValue(), text.split(' ')[0], text.split(' ')[1], 'Buy', '-', text.split(' ')[2], '=' + (text.split(' ')[0] * text.split(' ')[1]) + '+' + text.split(' ')[2]]);
                    name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '-' + (Number(text.split(' ')[0] * text.split(' ')[1]) + Number(text.split(' ')[2])));
                } else {
                    var new_count_shares = (Number(name.getRange((row_number + 2), 2).getValue()) + Number(text.split(' ')[0]));
                    var new_price = (Number(name.getRange((row_number + 2), 4).getValue()) + Number(text.split(' ')[0] * text.split(' ')[1])) / new_count_shares
                    name.getRange((row_number + 2), 2).setValue(new_count_shares);
                    name.getRange((row_number + 2), 3).setValue(new_price);
                    sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' bought ' + text.split(' ')[0] + ' shares of ' + technical_sheet.getRange(2, 7).getValue() + ' at $' + text.split(' ')[1] + ' per share with commision $' + text.split(' ')[2]);
                    transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), technical_sheet.getRange(2, 7).getValue(), text.split(' ')[0], text.split(' ')[1], 'Buy', '-', text.split(' ')[2], '=' + (text.split(' ')[0] * text.split(' ')[1]) + '+' + text.split(' ')[2]]);
                    name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '-' + (Number(text.split(' ')[0] * text.split(' ')[1]) + Number(text.split(' ')[2])));
                }
                resetToHomeboard();
                sendMessage(id, 'choose an action to do', homeBoard);
            } else {
                sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
            }
        } else if (((technical_sheet.getRange(2, 2).getValue() == 'Sell')) && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null) && (technical_sheet.getRange(2, 5).getValue() == '')) {
            if (prices_sheet.getRange(2, 1, prices_sheet.getLastRow()).getValues().toString().split(",").includes(text.split(' ')[0].toString().toUpperCase())) {

                if (text.split(' ').length > 1) {
                    if ((text.split(' ')[1].toString().toUpperCase() == 'IPO')) {
                        technical_sheet.getRange(2, 6).setValue(text.split(' ')[1].toString().toUpperCase());
                        technical_sheet.getRange(2, 5).setValue(text.split(' ')[0].toString().toUpperCase());
                        technical_sheet.getRange(2, 7).setValue(text.toString().toUpperCase());
                        sendMessage(id, technical_sheet.getRange(2, 4).getValue() + ' wants to sell ' + text.toString().toUpperCase() + '\n' + 'please enter number of shares, price, commission and IPN' + '\n' + 'ex.:10 32 6.3 0.5');
                    } else {
                        sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
                        technical_sheet.getRange(2, 5).setValue('');
                        technical_sheet.getRange(2, 6).setValue('');
                        technical_sheet.getRange(2, 7).setValue('');
                    }
                } else {
                    technical_sheet.getRange(2, 5).setValue(text.split(' ')[0].toString().toUpperCase());
                    technical_sheet.getRange(2, 7).setValue(text.toString().toUpperCase());
                    sendMessage(id, technical_sheet.getRange(2, 4).getValue() + ' wants to sell ' + text.toString().toUpperCase() + '\n' + 'please enter number of shares, price, commission and IPN' + '\n' + 'ex.:10 32 6.3 0.5');
                }
            } else {
                sendMessage(id, '🚫 There is no that symbol in the list, first add this symbol at the /home page');
            }
        } else if (((technical_sheet.getRange(2, 2).getValue() == 'Sell')) && (id == technical_sheet.getRange(2, 3).getValue()) && (technical_sheet.getRange(2, 4).getValue() != null) && (technical_sheet.getRange(2, 5).getValue() != '')) {
            if ((text.split(' ')[0] >= 0) && (text.split(' ')[1] >= 0) && (text.split(' ')[2] >= 0) && (text.split(' ')[3] >= 0)) {
                if ((row_number != -1) && (Number(name.getRange((row_number + 2), 2).getValue()) > Number(text.split(' ')[0]))) {
                    name.getRange((row_number + 2), 2).setValue(Number(name.getRange((row_number + 2), 2).getValue()) - Number(text.split(' ')[0]));
                    sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' sold ' + text.split(' ')[0] + ' shares of ' + technical_sheet.getRange(2, 7).getValue() + ' at $' + text.split(' ')[1] + ' per share with commision $' + text.split(' ')[2] + ' and IPN= $' + text.split(' ')[3]);
                    transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), technical_sheet.getRange(2, 7).getValue(), text.split(' ')[0], text.split(' ')[1], 'Sell', text.split(' ')[3], text.split(' ')[2], ((text.split(' ')[0] * text.split(' ')[1]) - text.split(' ')[2] - text.split(' ')[3])]);
                    name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '+' + (Number(text.split(' ')[0] * text.split(' ')[1]) - Number(text.split(' ')[2]) - Number(text.split(' ')[3])));
                    resetToHomeboard();
                    sendMessage(id, 'choose an action to do', homeBoard);
                } else if ((row_number != -1) && (Number(name.getRange((row_number + 2), 2).getValue()) == Number(text.split(' ')[0]))) {
                    name.getRange((row_number + 2), 1, 1, 9).deleteCells(SpreadsheetApp.Dimension.ROWS);
                    sendMessage(id, '✅ ' + technical_sheet.getRange(2, 4).getValue() + ' sold ' + text.split(' ')[0] + ' shares of ' + technical_sheet.getRange(2, 7).getValue() + ' at $' + text.split(' ')[1] + ' per share with commision $' + text.split(' ')[2] + ' and IPN= $' + text.split(' ')[3]);
                    transactions_sheet.appendRow([reformatedDate, technical_sheet.getRange(2, 4).getValue(), technical_sheet.getRange(2, 7).getValue(), text.split(' ')[0], text.split(' ')[1], 'Sell', text.split(' ')[3], text.split(' ')[2], ((text.split(' ')[0] * text.split(' ')[1]) - text.split(' ')[2] - text.split(' ')[3])]);
                    name.getRange(20, 2).setValue('=' + name.getRange(20, 2).getValue() + '+' + (Number(text.split(' ')[0] * text.split(' ')[1]) - Number(text.split(' ')[2]) - Number(text.split(' ')[3])));
                    resetToHomeboard();
                    sendMessage(id, 'choose an action to do', homeBoard);
                } else if ((row_number == -1) || (Number(name.getRange((row_number + 2), 2).getValue()) < Number(text.split(' ')[0]))) {
                    sendMessage(id, "🚫 " + technical_sheet.getRange(2, 4).getValue() + " does not have " + technical_sheet.getRange(2, 7).getValue() + " in portfolio or does not have that number of shares");
                }
            } else {
                sendMessage(id, '🔁 Wrong format, please try again or send /home to get back to the homepage');
            }
        }
    }
}
