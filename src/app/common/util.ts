import { Observable } from 'rxjs';

export function createHttpObservable(url: string) {
	return Observable.create(observer => {
		const controller = new AbortController();
		const signal = controller.signal;

		fetch(url, { signal })
			.then(respose => {
				if (respose.ok) {
					return respose.json();
				} else {
					observer.error('Request faild with status code: ' + respose.status);
				}
			})
			.then(body => {
				observer.next(body);

				observer.complete();
			})
			.catch(err => {
				observer.error(err);
			});

		return () => controller.abort();
	});
}
