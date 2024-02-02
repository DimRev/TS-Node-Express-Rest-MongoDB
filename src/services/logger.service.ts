import chalk from 'chalk'
import fs from 'fs'

export const loggerService = {
  debug(...args: any[]) {
    doLog('DEBUG', undefined, ...args)
  },
  info(...args: any[]) {
    doLog('INFO', undefined, ...args)
  },
  warn(...args: any[]) {
    doLog('WARN', undefined, ...args)
  },
  error(...args: any[]) {
    doLog('ERROR', undefined, ...args)
  },
  incoming(...args: any[]) {
    doLog('INCOMING', undefined, ...args)
  },
  outgoing(status: number, ...args: any[]) {
    doLog('OUTGOING', status, ...args)
  },
}

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

//define the time format
function getTime() {
  let now = new Date()
  return now.toLocaleString('he')
}

function isError(e: Error) {
  return e && e.stack && e.message
}

type Level = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'INCOMING' | 'OUTGOING'

function doLog(level: Level, status?: number, ...args: any[]) {
  const strs = args.map((arg) =>
    typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)
  )
  var line = strs.join(' | ')
  consoleLogger[level](line, status)
  line = `${getTime()} - ${level} - ${line}\n`
  fs.appendFile('./logs/backend.log', line, (err) => {
    if (err) console.log('FATAL: cannot write to log file')
  })
}

function checkStatus(status: number | undefined, type?: 'bg') {
  if (!status) {
    return type === 'bg' ? 'bgWhite' : 'white'
  } else if (status >= 200 && status < 300) {
    return type === 'bg' ? 'bgGreen' : 'green'
  } else {
    return type === 'bg' ? 'bgRed' : 'red'
  }
}

export class consoleLogger {
  public static INFO = (line: string) => console.log(chalk.bgBlue(`[INFO - ${getTime()}]`), chalk.blueBright(line))
  public static WARN = (line: string) => console.log(chalk.bgYellow(`[WARN - ${getTime()}]`), chalk.yellowBright(line))
  public static ERROR = (line: string) => console.log(chalk.bgRed.bold(`[ERROR - ${getTime()}]`), chalk.redBright(line))
  public static DEBUG = (line: string) => console.log(chalk.bgCyan(`[DEBUG - ${getTime()}]`), chalk.cyanBright(line))
  public static INCOMING = (line: string) => console.log(chalk.bgGreen.bold(`[INCOMING - ${getTime()}]`), chalk.green(line))
  public static OUTGOING = (line: string, status?: number) => console.log(chalk[checkStatus(status, 'bg')].bold(`[OUTGOING - ${getTime()}]`), chalk[checkStatus(status)](line), '\n')

}