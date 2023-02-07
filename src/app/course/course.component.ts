import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat, pipe } from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLogginLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
	courseId = this.route.snapshot.params['id'];
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

		this.course$ = createHttpObservable(`api/courses/${this.courseId}`)
			.pipe(
				debug( RxJsLoggingLevel.INFO, "course value: ")
			)
		
		setRxJsLogginLevel(RxJsLoggingLevel.DEBUG);
    }

    ngAfterViewInit() {

		const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
			.pipe(
				map(event => event.target.value),
				startWith(''),
				debug(RxJsLoggingLevel.TRACE, "search: "),
				debounceTime(400),
				distinctUntilChanged(),
				switchMap(search => this.loadLessons(search)),
				debug( RxJsLoggingLevel.DEBUG, 'lessons value: ' )
			);

			const initialLessons$ = this.loadLessons();
			this.lessons$ = concat(initialLessons$, searchLessons$);
    }

	loadLessons(search: string = ''): Observable<Lesson[]> {
		return createHttpObservable(`api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
		.pipe(
			map(res => res['payload'])
		)
	}


}
