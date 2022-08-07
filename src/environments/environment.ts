// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // 2. Add your credentials from step 1
  production: false,
  firebase: {
    apiKey: 'AIzaSyCScgTy_kk9SEFz2yfVOwT6JvaKpShKV7E',
    authDomain: 'test-8b44f.firebaseapp.com',
    databaseURL: 'https://test-8b44f-default-rtdb.firebaseio.com',
    projectId: 'test-8b44f',
    storageBucket: 'test-8b44f.appspot.com',
    messagingSenderId: '73916821728',
    appId: '1:73916821728:web:950bfa4d3dc72918bda085'
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
