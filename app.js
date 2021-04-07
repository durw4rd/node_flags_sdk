const optimizely = require('@optimizely/optimizely-sdk');

optimizely.setLogger(optimizelySDK.logging.createLogger());
optimizely.setLogLevel('debug'); 

const optimizelyClientInstance = optimizely.createInstance({
    sdkKey: '85yWu7wPbz4d6secu1pEm',
    eventBatchSize: 10,
    eventFlushInterval: 2000,
});

optimizelyClientInstance.onReady({ timeout: 5000 }).then((result) => {
    console.log(`[CUSTOM LOG] Optimizely successfully loaded: ${result.success}`);
    if(!result.success) {
        console.log(result.reason);
    }
});


optimizelyClientInstance.close().then((result) => {
    if (result.success === false) {
        console.log(`[CUSTOM LOG] Failed to close the client instance. Reason: ${result.reason}`);
    } else {
        console.log(`[CUSTOM LOG] Safe to close the app: ${result.success}. Closing the app!`);
        process.exit()      // exit the app
    }
});