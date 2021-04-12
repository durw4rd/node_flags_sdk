const optimizely = require('@optimizely/optimizely-sdk');
const {v4: uuidv4 } = require('uuid');      // import a plugin for uuid creation

// set logger
optimizely.setLogger(optimizely.logging.createLogger());
optimizely.setLogLevel('debug'); 

// initialize the client
const sdkKey = '85yWu7wPbz4d6secu1pEm';
const userId = uuidv4();    // create a single uuid OR
console.log(`[### CUSTOM LOG] User ID: ${userId}`);

// shorten the access path to 'OptimizelyDecideOption'
const decideOptions = optimizely.OptimizelyDecideOption;

const optimizelyClientInstance = optimizely.createInstance({
    sdkKey,
    eventBatchSize: 10,
    eventFlushInterval: 2000,
    datafileOptions: {
        autoUpdate: true,
        updateInterval: 10000,  // 10 seconds in milliseconds
        urlTemplate: 'https://cdn.optimizely.com/datafiles/%s.json'
    },
    defaultDecideOptions: [
        decideOptions.INCLUDE_REASONS
    ]
});

// use the SDK client
optimizelyClientInstance.onReady({ timeout: 5000 }).then((result) => {
    // check if we're good to go
    console.log(`[### CUSTOM LOG] Optimizely successfully loaded: ${result.success}`);
    if(!result.success) {
        console.log(result.reason);
    }

    // --------------- CORE ----------------------
    // seet user attributes
    let attributes = {
        loggedIn: false,
        burpees: 50
    };

    // set user context
    let userContext = optimizelyClientInstance.createUserContext(userId, attributes);

    // check the state of a flag
    const decision = userContext.decide('my_first_veloflag');
    console.log(decision);

    // check the state of all (enabled) flags
    const decisions = userContext.decideAll([decideOptions.ENABLED_FLAGS_ONLY]);
    console.log(decisions);

    // let variationKey = decision.variationKey;
    // let enabled = decision.enabled;
    // let ruleKey = decision.ruleKey;
    // let flagKey = decision.flagKey;
    // let variableKeys = Object.keys(decision.variables);
    // let variableValues = Object.values(decision.variables);
    // let variables = Object.entries(decision.variables);

    // console.log(`The flag is enabled: ${enabled} \nThe assigned variations is: ${variationKey} \nThe flag key is: ${flagKey} \nThe rule based on which the decision & variation were server is: ${ruleKey} \nThere are the following variables: ${variableKeys} \nAnd have these values: ${variableValues}`);
    // console.log(variables);

    // track an event
    userContext.trackEvent('conversion_1');


    // --------------- CORE END ------------------

    // closing the app
    let timeout = 3000;
    let timeoutInS = timeout/1000;
    console.log(`[### CUSTOM LOG] Will close the app in ${timeoutInS} seconds`);
    setTimeout(function() {
        optimizelyClientInstance.close().then((result) => {
            if (result.success === false) {
                console.log(`[### CUSTOM LOG] Failed to close the client instance. Reason: ${result.reason}`);
            } else {
                console.log(`[### CUSTOM LOG] Safe to close the app: ${result.success}. Closing the app!`);
                process.exit()      // exit the app
            }
        });
    }, timeout);
});