import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum RxJsLoggingLevel {
	TRACE,
	DEBUG,
	INFO,
	ERROR
}

let rxjsLogginLevel = RxJsLoggingLevel.INFO;

export function setRxJsLogginLevel(level: RxJsLoggingLevel) {
	rxjsLogginLevel = level;
}

export const debug = (level: number, message: string) => (source: Observable<any>) =>
	source.pipe(
		tap(val => {
			if (level >= rxjsLogginLevel) {
				console.log(message + ' ', val);

			}

		})
	);
