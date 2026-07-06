import chokidar from 'chokidar'
import { relative } from 'pathe'
import { wait, log } from 't0n/log'

export type ChokidarEventName = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir'

export function getRuntime() {
  try {
    return process?.isBun || typeof Bun !== 'undefined' ? 'bun' : 'node'
  } catch {
    return 'node'
  }
}

export function shutdown(cb: (signal: string, e: unknown) => void | Promise<void>) {
  if (!process) return
  const down = (signal: string) => (e?: unknown) => {
    try {
      cb(signal, e)
      setTimeout(() => process.exit(0), 100)
    } catch (e) {
      process.exit(1)
    }
  }

  process.on('SIGINT', down('SIGINT'))
  process.on('SIGTERM', down('SIGTERM'))
  process.on('SIGHUP', down('SIGHUP'))
  process.on('unhandledRejection', down('UNCAUGHT_REJECTION'))
  process.on('uncaughtException', down('UNCAUGHT_EXCEPTION'))
  // process.on('beforeExit', down('BEFORE_EXIT'))
  // process.on('exit', down('EXIT'))
}

export async function watch(
  cb: (e: ChokidarEventName | string, file: string) => Promise<void>,
  paths: string | string[],
  root?: string,
  ignore?: string | RegExp | ((testString: string) => boolean)
) {
	const codeWatcher = chokidar.watch(paths, {
		ignored: ignore ? ignore : /(^|[/\\])\../, // ignore hidden files
		persistent: true,
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 200,
			pollInterval: 100,
		},
  })

  let restartTimeout: NodeJS.Timeout | null = null
  const watcher = (e: ChokidarEventName) => async (file: string) => {
		log(getAssetChangeMessage(e, file, root))

		if (restartTimeout)
			clearTimeout(restartTimeout)

		restartTimeout = setTimeout(async () => {
			await cb(e, file)
		}, 300)
	}

	codeWatcher.on('change', watcher('change'))
	codeWatcher.on('add', watcher('add'))
	codeWatcher.on('unlink', watcher('unlink'))
	codeWatcher.on('addDir', watcher('addDir'))
	codeWatcher.on('unlinkDir', watcher('unlinkDir'))

	wait('Watching for file changes')
}
function getAssetChangeMessage(
	e: ChokidarEventName,
  path: string,
  root?: string
) {
	root && (path = relative(root, path))

	switch (e) {
		case 'add':
			return `File ${path} was added`
		case 'addDir':
			return `Directory ${path} was added`
		case 'unlink':
			return `File ${path} was removed`
		case 'unlinkDir':
			return `Directory ${path} was removed`
		case 'change':
		default:
			return `${path} changed`
	}
}
