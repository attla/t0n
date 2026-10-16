import { exec, execFile } from 'node:child_process'
import { error, warn } from './log'

export function withPort(
  desiredPort: number,
  cb: (port: number) => void,
  maxAttempts = 10,
) {
  getAvailablePort(desiredPort, maxAttempts)
    .then(([port, pid]) => {
      if (port !== desiredPort) {
        warn(`Port ${desiredPort} is in use by ${
          pid ? `process ${pid}` : 'an unknown process'
        }, using available port ${port} instead`)
      }

      cb(port)
    })
    .catch(e => error('Error finding available port:', e))
}

export async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    execFile(
      'lsof',
      ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'],
      { timeout: 1000 },
      (err, stdout) => {
        if (stdout.trim())
          return resolve(true)

        if (err && 'code' in err && err.code === 1)
          return resolve(false)

        if (err)
          return reject(err)

        resolve(false)
      },
    )
  })
}

export async function getAvailablePort(
  startPort: number,
  maxAttempts = 10,
): Promise<[number, string | null]> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i

    if (!await isPortInUse(port)) {
      const pid = port === startPort
        ? null
        : await getProcessIdUsingPort(startPort)

      return [port, pid]
    }
  }

  throw new Error(
    `No available ports found after ${maxAttempts} attempts`,
  )
}

export async function getProcessIdUsingPort(port: number): Promise<string | null> {
  const timeoutMs = 250
  const processLookupController = new AbortController()

  const pidPromise = new Promise<string | null>((resolve) => {
    const handleError = (e: Error) => {
      if ((e as any).name === 'AbortError')
        return resolve(null)

      error('Failed to get process ID for port', port, e)
      resolve(null)
    }

    try { // use lsof on Unix-like systems (macOS, Linux)
      if (process.platform !== 'win32') {
        exec(
          `lsof -nP -iTCP:${port} -sTCP:LISTEN -t`,
          { signal: processLookupController.signal, timeout: 2000 },
          (error, stdout) => {
            if (error) return handleError(error)
            // `-sTCP` will ensure there's only one port, clean up output
            const pid = stdout.trim()
            resolve(pid || null)
          }
        )
      } else { // use netstat on Windows
        exec(
          `netstat -ano | findstr /C:":${port} " | findstr LISTENING`,
          { signal: processLookupController.signal },
          (error, stdout) => {
            if (error) return handleError(error)
            // clean up output and extract PID
            const cleanOutput = stdout.replace(/\s+/g, ' ').trim()
            if (cleanOutput) {
              const lines = cleanOutput.split('\n')
              const firstLine = lines[0].trim()
              if (firstLine) {
                const parts = firstLine.split(' ')
                const pid = parts[parts.length - 1]
                resolve(pid || null)
              } else {
                resolve(null)
              }
            } else {
              resolve(null)
            }
          }
        )
      }
    } catch (cause) {
      handleError(new Error('Unexpected error during process lookup', { cause }))
    }
  })

  const timeoutId = setTimeout(() => {
    processLookupController.abort(`PID detection timed out after ${timeoutMs}ms for port ${port}.`)
  }, timeoutMs)

  pidPromise.finally(() => clearTimeout(timeoutId))

  return pidPromise
}
