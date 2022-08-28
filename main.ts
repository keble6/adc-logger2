function readTime () {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute()
    dateTime = "" + date + " " + time
}
function makeReading () {
    ADC0 = "" + convertToText(ADS1115.readADC(0)) + ","
    ADC1 = "" + convertToText(ADS1115.readADC(1)) + ","
    ADC2 = "" + convertToText(ADS1115.readADC(2)) + ","
    ADC3 = "" + convertToText(ADS1115.readADC(3)) + ","
}
function resetReadings () {
    count = 0
    dateTimeReadings = []
    Vreadings0 = []
    Vreadings1 = []
    Vreadings2 = []
    Vreadings3 = []
}
input.onButtonPressed(Button.A, function () {
    readTime()
    basic.showString(dateTime)
})
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
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    stringIn = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    command = stringIn.substr(0, 2)
    serial.writeLine("command = " + command)
    if (command.compare("rt") == 0) {
        readTime()
        serial.writeLine("#read time")
    } else if (command.compare("st") == 0) {
        setTime(stringIn)
        serial.writeLine("#set time")
    } else if (command.compare("sd") == 0) {
        setDate(stringIn)
        serial.writeLine("#set date")
    } else if (command.compare("up") == 0) {
        upload()
        serial.writeLine("#upload")
    } else if (command.compare("xx") == 0) {
        resetReadings()
        serial.writeLine("#resetReadings")
    }
})
function upload () {
    if (count > 0) {
        serial.writeLine("#uploading")
        basic.pause(1000)
        for (let index = 0; index <= count - 1; index++) {
            bluetooth.uartWriteString(dateTimeReadings[index])
            basic.pause(100)
            bluetooth.uartWriteString(Vreadings0[index])
            basic.pause(100)
            bluetooth.uartWriteString(Vreadings1[index])
            basic.pause(100)
            bluetooth.uartWriteString(Vreadings2[index])
            basic.pause(100)
            bluetooth.uartWriteString(Vreadings3[index])
            basic.pause(100)
        }
    }
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
input.onButtonPressed(Button.B, function () {
    makeReading()
    basic.showString(ADC0)
    basic.showString(ADC1)
    basic.showString(ADC2)
    basic.showString(ADC3)
})
let command = ""
let stringIn = ""
let params = ""
let Vreadings3: string[] = []
let Vreadings2: string[] = []
let Vreadings1: string[] = []
let Vreadings0: string[] = []
let dateTimeReadings: string[] = []
let count = 0
let ADC3 = ""
let ADC2 = ""
let ADC1 = ""
let ADC0 = ""
let dateTime = ""
let time = ""
let date = ""
serial.writeLine("#starting")
bluetooth.uartWriteString("starting")
bluetooth.startUartService()
let oneMinute = 60000
resetReadings()
loops.everyInterval(oneMinute, function () {
    if (DS3231.minute() % 15 == 0) {
        serial.writeLine("#making a reading")
        readTime()
        dateTimeReadings.push(dateTime)
        makeReading()
        Vreadings0.push(ADC0)
        Vreadings1.push(ADC1)
        Vreadings2.push(ADC2)
        Vreadings3.push(ADC3)
    }
    count += 1
    led.plot(4, 0)
    basic.pause(50)
    led.unplot(4, 0)
})
