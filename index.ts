import './style.css';

import { map, take, delay, mergeMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

// Should emit the second observable after the first, ahead of completion, and map to a new value.
// Context: http request dependent on result of first

// Simulate http request with parameters derived from response from another request
function fakeHttp2(v: number = 0): Observable<number> {
  return new BehaviorSubject(v).pipe(
    delay(5),
    tap((m) => console.log('request 2 returning...')),
    take(1)
  );
}

enum RESULT {
  WIN = 'Winner!',
  FAIL = 'Something went wrong!',
}

// Open the console in the bottom right to see results.
const fakeHttp1 = new BehaviorSubject(1).pipe(
  delay(3),
  tap((m) => console.log('request 1 returning...')),
  take(1)
);

fakeHttp1
  .pipe(
    mergeMap((a: number) => {
      return fakeHttp2(a).pipe(map((i) => (i > 0 ? RESULT.WIN : RESULT.FAIL)));
    })
  )
  .subscribe({
    next: (z: RESULT) => console.log(z),
    complete: () => console.log('Complete!'),
  });
