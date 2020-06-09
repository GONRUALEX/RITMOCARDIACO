const getLocalStorage = ():Storage=> (typeof window !=='undefined')? window.localStorage:null;

export const LOCALSTORAGE_PROVIDER ={ provide: 'LOCALSTORAGE', useFactory: getLocalStorage };