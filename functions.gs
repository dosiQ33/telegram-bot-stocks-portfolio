function getPhoneNumber(chatId, text, keyBoard) {
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

function editReply(cid, mid, keyBoard) {
    var data = {
        method: "post",
        payload: {
            method: "editMessageReplyMarkup",
            chat_id: String(cid),
            message_id: mid,
            reply_markup: JSON.stringify(keyBoard)
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function deleteMsg(cid, mid) {
    var data = {
        method: "post",
        payload: {
            method: "deleteMessage",
            chat_id: String(cid),
            message_id: mid
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function sheetToPDF(sheethere, user_name) {
    var url_base = SpreadsheetApp.openById(sheetId).getUrl().replace(/edit$/, '');
    var url_ext = 'export?exportFormat=pdf&format=pdf' + (sheethere.getSheetId() ? ('&gid=' + sheethere.getSheetId()) : ('&id=' + "1oQAJQD-vzajTPaatV6sX1nPvvWt3P_wrFHJ1BRdNZSU"))
      + '&gridlines=false'
//      + '&horizontal_alignment=CENTER'
      + '&top_margin=0.25'              
      + '&bottom_margin=0.25'          
      + '&left_margin=0.25'             
      + '&right_margin=0.25'
    var options = {
        headers: {
            'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
        }
    }
    var response = UrlFetchApp.fetch(url_base + url_ext, options);
    var dateNow = new Date;
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    var date_to_name = dateNow.getDate() + '' + (monthNames[dateNow.getMonth()]) + '' + dateNow.getFullYear();
    var blob = response.getBlob().setName(date_to_name.toString() + ' ' + user_name + '.pdf');
    return blob;
}

function sheetToXlsx() {
   var url_base = SpreadsheetApp.openById(sheetId).getUrl().replace(/edit$/, '');
   var url_ext = 'export?exportFormat=xlsx'
   var options = {
       headers: {
           'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
       }
   }
   var response = UrlFetchApp.fetch(url_base + url_ext, options);
   const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
   var dateNow = new Date;
   var date_to_name = dateNow.getDate() + '' + (monthNames[dateNow.getMonth()]) + '' + dateNow.getFullYear();
   var blob = response.getBlob().setName('report for '+date_to_name.toString() + '.xlsx');
   return blob;
}

function sendDocument(chatId, docUrl) {
    var data = {
        method: "post",
        payload: {
            method: "sendDocument",
            chat_id: String(chatId),
            document: docUrl
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function sendPhoto(chatId, docUrl) {
    var data = {
        method: "post",
        payload: {
            method: "sendPhoto",
            chat_id: String(chatId),
            photo: docUrl
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function sendVoice(chatId, docUrl) {
    var data = {
        method: "post",
        payload: {
            method: "sendVoice",
            chat_id: String(chatId),
            photo: docUrl
        }
    };
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function resetToHomeboard() {
    technical_sheet.getRange(2, 1).setValue(1);
    technical_sheet.getRange(2, 2).setValue('');
    technical_sheet.getRange(2, 3).setValue('');
    technical_sheet.getRange(2, 4).setValue('');
    technical_sheet.getRange(2, 5).setValue('');
    technical_sheet.getRange(2, 6).setValue('');
    technical_sheet.getRange(2, 7).setValue('');
}

function sendChatAction(chatId) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendChatAction?chat_id=' + chatId + '&action=upload_document');
}

function sendChatActionTyping(chatId) {
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendChatAction?chat_id=' + chatId + '&action=typing');
}


function sortingByGain(name_of_user){
     SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).clearConditionalFormatRules();
     SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 1,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 9).sort({column: 5, ascending: false});
     var rule1 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberBetween(0.1, 1000)
         .setBackground("#a4fba6")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rule2 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberBetween(1000, 5000)
         .setBackground("#30cb00")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rule3 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberGreaterThanOrEqualTo(5000)
         .setBackground("#0f9200")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rule4 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberBetween(-0.1, -600)
         .setBackground("#ffbaba")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rule5 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberBetween(-601, -3000)
         .setBackground("#ff5252")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rule6 = SpreadsheetApp.newConditionalFormatRule()
         .whenNumberLessThanOrEqualTo(-3000)
         .setBackground("#ff0000")
         .setRanges([SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getRange(43, 5,SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getLastRow()-42, 1)])
         .build();
     var rules = SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).getConditionalFormatRules();
     rules.push(rule1);
     rules.push(rule2);
     rules.push(rule3);
     rules.push(rule4);
     rules.push(rule5);
     rules.push(rule6);
     SpreadsheetApp.openById(sheetId).getSheetByName(name_of_user).setConditionalFormatRules(rules);
}
