function readTime (text: string) {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute()
    dateTime = "" + date + " " + time
}
radio.onReceivedString(function (receivedString) {
    if (receivedString.substr(0, 2) == "rt") {
        readTime(receivedString)
        radio.sendString("" + (dateTime))
    }
})
let dateTime: string = []
let time: string = []
let date: string = []
radio.setGroup(1)
radio.setTransmitPower(7)
