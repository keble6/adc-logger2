function readTime () {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute()
    dateTime = "" + date + " " + time
}
function setDate (text: string) {
    params = text.substr(2, text.length - 2)
    DS3231.dateTime(
    parseFloat(params.substr(4, 4)),
    parseFloat(params.substr(2, 2)),
    parseFloat(params.substr(0, 2)),
    DS3231.day(),
    DS3231.hour(),
    DS3231.minute(),
    DS3231.second()
    )
}
function setTime (text: string) {
    params = text.substr(2, text.length - 2)
    DS3231.dateTime(
    DS3231.year(),
    DS3231.month(),
    DS3231.date(),
    DS3231.day(),
    parseFloat(params.substr(0, 2)),
    parseFloat(params.substr(2, 2)),
    0
    )
}
radio.onReceivedString(function (receivedString) {
    command = receivedString.substr(0, 2)
    serial.writeLine("command = " + command)
    if (command.compare("rt") == 0) {
        readTime()
        radio.sendString(dateTime)
        serial.writeLine("#read time")
    } else if (command.compare("st") == 0) {
        setTime(receivedString)
        serial.writeLine("#set time")
    } else if (command.compare("sd") == 0) {
        setDate(receivedString)
        serial.writeLine("#set date")
    }
})
let command = ""
let params = ""
let dateTime = ""
let time = ""
let date = ""
radio.setGroup(1)
radio.setTransmitPower(7)
serial.writeLine("starting")
