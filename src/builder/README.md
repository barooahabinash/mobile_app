<h1>VS-Mobile builder script.</h1>

 <p>The following is a very basic command line script which is used to configure the application before building the
 application using the 'ionic capacitor build' or 'ionic capacitor run' commands. It's a quick and easy way of altering the configuration
 of a build without having to resort to manually changing configuration settings in the code.</p>
 
 <p>The must first specify an action ('build' or 'run'), followed by a platform ('ios' or 'android'), followed by a 
 config ('dev' for development or 'prod' for production). An example command would be: 'vs-mobile build android dev'.</p>
 
 <p>If the app is built/run in production the user may optionally specify a client name for which they want to configure the app. 
 E.g. 'vs-mobile build ios prod clientname'. If a client name is not provided, the demo configuration is used by default.</p>