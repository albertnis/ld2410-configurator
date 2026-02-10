import { Observable, of, type OperatorFunction } from "rxjs";
import { buffer, concatMap, debounceTime, delay } from "rxjs/operators";

type BufferDebounce = <T>(debounce: number) => OperatorFunction<T, T[]>;
export const bufferDebounce: BufferDebounce = (debounce) => (source) =>
  new Observable((observer) =>
    source.pipe(buffer(source.pipe(debounceTime(debounce)))).subscribe(observer)
  );

type RateLimit = <T>(delayTime: number) => OperatorFunction<T, T>;
export const rateLimit: RateLimit = (delayTime) => (source) =>
  new Observable((observer) =>
    source
      .pipe(concatMap((value) => of(value).pipe(delay(delayTime))))
      .subscribe(observer)
  );
