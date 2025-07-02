import { signal } from "@angular/core";
import { environment } from "../environments/environment.development"

export const version = signal("")

export const label = signal("")

export const global_const = {
    pyServer: "http://localhost:8001",
    connection: signal<boolean>(false),
    socket: "ws://localhost:8001/ws/calibration",
    org_name: "SÜD-CHEMIE",
    permission: 'permission',
    cryptoKey: 'ptm',       
    token: 'token',
    emailRegex : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    startSpace : /^[^\s].*$/,
    name: /^[A-Za-z]+(\s[A-Za-z]+)*$/,
    auditName: /^[A-Za-z0-9_()\-\s]+$/,
    panRegex : /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
    gstRegex : /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}$/,
    websiteRegex :  /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    phoneRegex : /^[^a-zA-Z]*$/,
    //passwordRegex : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    passwordRegex : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\S]{8,}$/,
    tagCodeRegex: /^[A-Z]{4}\d{4}$/,//Added By Snehal on 12/08/2024 will check first 4 digit alphabets & next 4 digit numbers
    imgUpload: `${environment.apiUrl}/Uploads/`,
    docsUpload: `/Documents/`,
    singleDigitNumber: /^[1-9]{1}$/, // ///Added By Snehal on 20/08/2024 willallow only numbers in single digit
    noNumberAllowed: /^([^0-9]*)$/,
    userRegex: /^[a-zA-Z0-9_.]{3,20}$/,
    username: /^(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9._]{4,20}(?<![_\.])$/,
    // twoDecimalOnlyNumber: /^\d+(\.\d{1,2})?$/
    twoDecimalOnlyNumber: /^\d{1,13}(\.\d{1,2})?$/,
    currencyType: 'en-IN',
    currencySymbol: 'INR',
    // contactNoIndia: /^[6-9]\d{9}$/
    contactNoIndia: /^\d{10}$/,
    _15Digit: /^.{1,15}$/,
    EncryptKey: '1203199320052021',
    EncryptIV: '1203199320052021',
    allowDot: /^\d{1,13}(\.\d{1,2})?$/,
    decimalNumberMinusValue: /^-?\d+(\.\d{1,6})?$/,
// /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g Master Phone no. regex
}

export const remove_tokens = () => {
    localStorage.removeItem(global_const.token);
    localStorage.removeItem("permission");
    localStorage.removeItem("organization");
}

export const handle_socket_state = (state: boolean) => {
    global_const.connection.set(state)
    return state
}