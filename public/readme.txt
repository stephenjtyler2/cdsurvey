config.js contains 
  - the serverURL for accessing the back-end API, 
  - the build number that is displayed in the UI
  - whether the app is broken or not

config.js_broken and config.js_fixed are examples

  - cp config.js_broken config.js to break it
  - cp config.js_fixed config.js to fix it

... or create your own - but be careful the app does not do error checking on the syntax or content of this file.


All of the pages displayed are in the components under /routes.

