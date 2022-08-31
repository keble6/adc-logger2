function readTime () {
    date = "" + DS3231.date() + "/" + DS3231.month() + "/" + DS3231.year()
    time = "" + DS3231.hour() + ":" + DS3231.minute()
    dateTime = "" + date + " " + time + ","
}
function makeReading () {
    ADC0 = "" + _2decPlaces(ADS1115.readADC(0), 3) + ","
    ADC1 = "" + _2decPlaces(ADS1115.readADC(1), 3) + ","
    ADC2 = "" + _2decPlaces(ADS1115.readADC(2), 3) + ","
    ADC3 = convertToText(_2decPlaces(ADS1115.readADC(3), 3))
}
function resetReadings () {
    count = 0
    dateTimeReadings = []
    Vreadings0 = []
    Vreadings1 = []
    Vreadings2 = []
    Vreadings3 = []
}
function _2decPlaces (num: number, places: number) {
    a = 10 ** places
    b = Math.round(num * a)
    return b / a
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
function upload () {
    if (count > 0) {
        basic.pause(1000)
        for (let index = 0; index <= count - 1; index++) {
        	
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
let b = 0
let a = 0
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
let oneMinute = 60000
resetReadings()
loops.everyInterval(oneMinute, function () {
    if (DS3231.minute() % 5 == 0) {
        readTime()
        dateTimeReadings.push(dateTime)
        makeReading()
        Vreadings0.push(ADC0)
        Vreadings1.push(ADC1)
        Vreadings2.push(ADC2)
        Vreadings3.push(ADC3)
        count += 1
    }
    led.plot(4, 0)
    basic.pause(50)
    led.unplot(4, 0)
})
basic.forever(function () {
    stringIn = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
    command = stringIn.substr(0, 2)
    if (command.compare("rt") == 0) {
        readTime()
        bluetooth.uartWriteString(dateTime)
    } else if (command.compare("st") == 0) {
        setTime(stringIn)
    } else if (command.compare("sd") == 0) {
        setDate(stringIn)
    } else if (command.compare("up") == 0) {
        upload()
    } else if (command.compare("xx") == 0) {
        resetReadings()
    }
})
basic.forever(function () {
    basic.showIcon(IconNames.Square)
    basic.pause(2000)
    basic.clearScreen()
})
basic.forever(function () {
    let index = 0
    basic.showString("" + (dateTimeReadings[index]))
    basic.showString("" + (Vreadings0[index]))
    basic.showString("" + (Vreadings1[index]))
    basic.showString("" + (Vreadings2[index]))
    basic.showString("" + (Vreadings3[index]))
})
