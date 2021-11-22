#!/usr/bin/env node

/**
 * --------------------------------------------------------------------
 * VS-Mobile builder script.
 * --------------------------------------------------------------------
 * 
 * The following is a very basic command line script which is used to configure the application before building the
 * application using the 'ionic capacitor build' or 'ionic capacitor run' commands.
 * 
 * The must first specify an action ('build' or 'run'), followed by a platform ('ios' or 'android'), followed by a 
 * config ('dev' for development or 'prod' for production). 
 * 
 * An example command would be: 'vs-mobile build android dev'.
 * 
 * If the app is built/run in production the user may optionally specify a client name for which they want to configure the app. 
 * E.g. 'vs-mobile build ios prod clientname'. If a client name is not provided, the demo configuration is used by default.
 */

console.log('\nRunning VS-Mobile builder...\n');


//
// First we need to validate the variables passed into the script.
//
let action, platform, config;

//Validate and get the action being performed (build or run).
if (process.argv.length < 3 || ! ['build', 'run'].includes(process.argv[2])) {
    console.log('ERROR: You must provide a valid action.');
    console.log('ERROR: Choose \'build\' to build or \'run\' to build and then run the live update server.\n');
    return;
}
action = process.argv[2];

//Validate and get the platform to build for.
if (process.argv.length < 4 || ! ['ios', 'android'].includes(process.argv[3])) {
    console.log('ERROR: You must provide a valid platform to build for.');
    console.log('ERROR: Choose \'ios\' or \'android\'.\n');
    return;
}
platform = process.argv[3];

//Validate and get the configuration the action should be run in (dev or prod).
if (process.argv.length < 5 || ! ['dev', 'prod'].includes(process.argv[4])) {
    console.log('ERROR: You must specify how you want to configure the build.');
    console.log('ERROR: Choose \'dev\' to configure a development build, or \'prod\' to configure a production build.\n');
    return;
}
config = process.argv[4];


//
// Set the client URL and client app name in builder.config.json.
//
builderConfig = require('./builder.config.json');
builderConfig.config = config;

const originalConfig = builderConfig;
let clientAppName;

// If config is dev or if config is prod and no client name has been passed in, set the client info from demo.
if (config === 'dev' || (config === 'prod' && process.argv.length < 6 )) {
    builderConfig.clientUrl = builderConfig.clients.demo.url;
    builderConfig.clientAppName = builderConfig.clients.demo.appName;
    clientAppName = builderConfig.clients.demo.appName;
}

else {
    // The the user has provided a customer, but it does not exist in the clients object in builder.config.json
    // then log an error and exit the script.
    if (! builderConfig.clients[process.argv[5]]) {
        console.log('ERROR: The customer name you have provided does not exist.');
        console.log('ERROR: Please provide a valid client name, add a new client into builder.config.json, or leave this option blank to default to \'demo\'.\n');
        return;
    }

    builderConfig.clientUrl = builderConfig.clients[process.argv[5]].url;
    builderConfig.clientAppName = builderConfig.clients[process.argv[5]].appName;
    clientAppName = builderConfig.clients[process.argv[5]].appName;
}


//
// Set the identifier key in builder.config.json.
//
const identifierKey = config === 'prod' ? 'com.visualsoft.' + clientAppName : 'dev.visualsoft.' + clientAppName;
builderConfig.identifierKey = identifierKey;


//
// Write the new values into the builder.config.json file.
//
const fs = require('fs');
fs.writeFileSync('src/builder/builder.config.json', JSON.stringify(builderConfig, null, 4), error => {
    if (error) {
        console.log('ERROR: An error occured when writing to the builder.config.json file: ' + error + '\n');
    }
});


//
// Run the correct ionic capacitor command.
//
console.log(action === 'build' ? 'Building...\n' : 'Building and running live update server...\n');

let command = 'ionic capacitor ' + action + ' ' + platform;
if (action === 'run') command += ' -l --external --public-host=' + require('ip').address();
require('child_process').execSync(command, {stdio: 'inherit'});

console.log('\nClosing VS-Mobile builder...\n');

return;