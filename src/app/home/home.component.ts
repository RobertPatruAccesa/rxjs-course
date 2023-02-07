import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { interval, noop, Observable, of, pipe, throwError, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, finalize } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
	selector: 'home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	beginnersCourses$!: Observable<Course[]>;
	advancedCourses$!: Observable<Course[]>;

	constructor() {}

	ngOnInit() {
		const http$ = createHttpObservable('/api/courses');

		const courses$: Observable<Course[]> = http$.pipe(
			tap(() => console.log('http request executed')),
			map(res => Object.values(res['payload'])),
			shareReplay(),
			retryWhen(errors => errors.pipe(
				delayWhen( () => timer(2000) )
			) )
		);

		this.beginnersCourses$ = courses$.pipe(
			map((courses: Course[]) => courses.filter(el => el.category == 'BEGINNER'))
		);

		this.advancedCourses$ = courses$.pipe(
			map((courses: Course[]) => courses.filter(el => el.category == 'ADVANCED'))
		);
	}
}
