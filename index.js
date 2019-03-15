//node --max-old-space-size=7000 index.js
const fs = require('fs')
const readline = require('readline')
const csv = require('fast-csv')
const logUpdate = require('log-update')
//--------------------------------------------------------------------------------------------------
const Date = /(.+\d{2}:\d{2}:\d{2})/
const Session = /session=<(.+)>/
const Login = /([^<>()=,' ]+@[^<>()=,' ]+)/
const Country = /country=(.+)city/
const City = /city=(.+)network/
const Application = /mail3[ ]{1}([^:[]+)/
const Protocol = /dovecot: ([a-z\d\-*]+)/
const IP = /whois.+ip=(.+)from/
const IPrip = /rip=([\d\.]+)/
const IPlip = /lip=([\d\.]+)/
const Port = /\[(\d+)\]/
const Process = /mail3 post.+: ([a-zA-Z.\-\d ]+)\[|mail3 .+: ([A-Z][a-z]+)\W{2,}/
const PatternProcess = /(\w*nne\w*)/
//--------------------------------------------------------------------------------------------------
let lineCount = 0
let csvStream = csv.createWriteStream({headers: [
                "Date",
                "Application",
                "Protocol",
                "Process",
                "Pattern Process",
                "Port",
                "Login",
                "IP",
                "rip",
                "lip",
                "Country",
                "City",
                "Session"
],
    delimiter: ";"
})

let list = [
    Date,
    Application,
    Protocol,
    Process,
    PatternProcess,
    Port,
    Login,
    IP,
    IPrip,
    IPlip,
    Country,
    City,
    Session
]
let inputStream = fs.createReadStream(__dirname + '/maillog.txt', encoding = 'utf-8')
let rl = readline.createInterface(inputStream)
let outputStream = fs.createWriteStream(__dirname + "/parsed2.csv")
    csvStream.pipe(outputStream)
//--------------------------------------------------------------------------------------------------
function Parse(list, input) {
    inputStream.pause()
    let line = []
    for (let i = 0; i < list.length; i++) {
        let parsed = input.match(list[i])
        if (parsed != null) {
            if (parsed[1] != undefined) line.push(parsed[1])
            else line.push(parsed[2])
        }
        else {
            line.push("NA")
        }
    }
    csvStream.write(line)
    inputStream.resume()
}
//--------------------------------------------------------------------------------------------------
rl.on('line', (input) => {
    lineCount += 1
    Parse(list, input)
    logUpdate(`Parsed ${lineCount} lines`)
})
//--------------------------------------------------------------------------------------------------
rl.on('close', () => {
    csvStream.end()
    console.log("Wait!")
})
//--------------------------------------------------------------------------------------------------