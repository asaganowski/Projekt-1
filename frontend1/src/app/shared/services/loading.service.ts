import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, of, noop, tap, switchMap, finalize } from "rxjs";

@Injectable()
export class LoadingService {

    private _loadingSubject = new BehaviorSubject<boolean>(false);
    private _initMessageSubject = new BehaviorSubject<boolean>(false);

    loading$: Observable<boolean> = this._loadingSubject.asObservable();
    initMessage$: Observable<boolean> = this._initMessageSubject.asObservable();

    showLoaderUntilCompleted<T>(): (source$: Observable<T>) => Observable<T> {
      return (source$: Observable<T>) => of(noop).pipe(
          tap(() => this.loadingOn()),
          switchMap(() => source$),
          finalize(() => this.loadingOff())
      )
  }

    loadingOn():void {
        this._loadingSubject.next(true);
    }

    loadingOff():void {
        this._loadingSubject.next(false);
    }
}