import chalk from 'chalk'
import fs from 'fs'

export const loggerService = {
  debug(...args: any[]) {
    doLog('DEBUG', ...args)
  },
  info(...args: any[]) {
    doLog('INFO', ...args)
  },
  warn(...args: any[]) {
    doLog('WARN', ...args)
  },
  error(...args: any[]) {
    doLog('ERROR', ...args)
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

type Level = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'

function doLog(level: Level, ...args: any[]) {
  const strs = args.map((arg) =>
    typeof arg === 'string' || isError(arg) ? arg : JSON.stringify(arg)
  )
  var line = strs.join(' | ')
  line = `${getTime()} - ${level} - ${line}\n`

  consoleLogger[level](line)

  fs.appendFile('./logs/backend.log', line, (err) => {
    if (err) console.log('FATAL: cannot write to log file')
  })
}

export class consoleLogger {
  public static INFO = (args: any) => console.log(chalk.blue('[INFO]'), typeof args === 'string' ? chalk.blueBright(args) : args)
  public static WARN = (args: any) => console.log(chalk.yellow('[WARN]'), typeof args === 'string' ? chalk.yellowBright(args) : args)
  public static ERROR = (args: any) => console.log(chalk.red('[ERROR]'), typeof args === 'string' ? chalk.redBright(args) : args)
  public static DEBUG = (args: any) => console.log(chalk.cyan('[DEBUG]'), typeof args === 'string' ? chalk.cyanBright(args) : args)
}