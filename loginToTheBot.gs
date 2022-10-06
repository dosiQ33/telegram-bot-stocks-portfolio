function loginToTheBot(contents) {
    var id = contents.message.from.id;
    var text = contents.message.text;
    var first_name = contents.message.from.first_name;
    var message_id = contents.message.message_id;
    var dateNow = new Date;
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    var allowed_telegram_id_list = logins_sheet.getRange(2, 3, logins_sheet.getLastRow()).getValues().toString(); // in case of if add .split(",") to get list
    var allowed_telegram_phone_list = logins_sheet.getRange(2, 1, logins_sheet.getLastRow()).getValues().toString(); // in case of if add .split(",") to get list
    try {
        var phone_number = contents.message.contact.phone_number;
    } catch (e) {}
    try {
        var vcard = contents.message.contact.vcard;
    } catch (e) {}
    var contact_request = {
        "one_time_keyboard": true,
        "resize_keyboard": true,
        "keyboard": [
            [{
                text: "Continue",
                request_contact: true
            }]
        ]
    };

    if (allowed_telegram_id_list.split(",").includes(id.toString())) {
        if ((text == '/home') && (logins_sheet.getRange(allowed_telegram_id_list.split(",").indexOf(id.toString()) + 2, 4).getValue() == 'admin')) {
            resetToHomeboard();
            sendMessage(id, 'choose an action to do', homeBoard);
            deleteMsg(id, message_id);
        } else if ((text == '/download')) {
            sendChatAction(id);
            sendChatAction(id);
            sortingByGain(logins_sheet.getRange(allowed_telegram_id_list.split(",").indexOf(id.toString()) + 2, 2).getValue());
            SpreadsheetApp.openById(sheetId).getSheetByName(logins_sheet.getRange(allowed_telegram_id_list.split(",").indexOf(id.toString()) + 2, 2).getValue()).getRange(9, 4).setValue('         Portfolio summary for '+ dateNow.getDate()+ ' ' + (monthNames[dateNow.getMonth()]) + ' ' + dateNow.getFullYear());
            sendDocument(id, sheetToPDF(SpreadsheetApp.openById(sheetId).getSheetByName(logins_sheet.getRange(allowed_telegram_id_list.split(",").indexOf(id.toString()) + 2, 2).getValue()), logins_sheet.getRange(allowed_telegram_id_list.split(",").indexOf(id.toString()) + 2, 2).getValue().toString()));
        }

    } else {
        if ((phone_number != null) && (vcard == undefined)) {
            if (allowed_telegram_phone_list.split(",").includes(phone_number.toString().replace(/\D/g, ""))) {
                logins_sheet.getRange(allowed_telegram_phone_list.split(",").indexOf(phone_number.toString().replace(/\D/g, "")) + 2, 3).setValue(id);
                sendMessage(id, '✅ Registration is complete, now you can use features of this bot', delete_keyboard);
                if (logins_sheet.getRange(allowed_telegram_phone_list.split(",").indexOf(phone_number.toString().replace(/\D/g, "")) + 2, 4).getValue() == 'admin') {
                    resetToHomeboard();
                    sendMessage(id, 'choose an action to do', homeBoard);
                } else if (logins_sheet.getRange(allowed_telegram_phone_list.split(",").indexOf(phone_number.toString().replace(/\D/g, "")) + 2, 4).getValue() == 'user') {
                    sendMessage(id, 'send /download to get portfolio summary');
                }
            } else {
                sendMessage(id, 'Sorry, you are not allowed to use features of this bot 😢', delete_keyboard);
            }
        } else if ((phone_number != null) && (vcard != null)) {
            getPhoneNumber(id, '👊🏼 You must share your phone number to use all features of this bot', contact_request);
        } else {
            getPhoneNumber(id, '👋🏼 Hello, you can complete verification process by clicking "Continue" button below.', contact_request);
        }
    }

}
