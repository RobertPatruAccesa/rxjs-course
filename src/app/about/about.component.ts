import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, fromEvent, Observable, noop, of, concat, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
	selector: 'about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		const http$ = createHttpObservable('/api/courses');
		const sub = http$.subscribe(res => console.log(res));

		setTimeout(() => sub.unsubscribe(), 0);
	}
}
