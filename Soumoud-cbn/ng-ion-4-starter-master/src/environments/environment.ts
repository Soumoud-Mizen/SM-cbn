// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  bffUrl: 'https://chicha-by-night-260810.appspot.com',
  stripe: { PUBLISHABLE_KEY: 'pk_test_uUZyR9OxEHVgr6PymdcC904000zPdXU1cn' },
   firebase: {
    apiKey: 'AIzaSyDbeHOv9ArM34GITmahFvWuqFXavGCaH-k',
    authDomain: 'chicha-by-night-260810.firebaseapp.com',
    databaseURL: 'https://chicha-by-night-260810.firebaseio.com',
    projectId: 'chicha-by-night-260810',
    storageBucket: 'chicha-by-night-260810.appspot.com',
    messagingSenderId: '582987266636',
    appId: '1:582987266636:web:695640e9987197a93392e9',
    measurementId: 'G-HP3HNX07K7'
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
