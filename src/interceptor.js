// Interceptor for http if needed
['msalAuthenticationService', '$q', '$rootScope', '$templateCache',
    function protectedResourceInterceptor(authService, $q, $rootScope, $templateCache) {
        "use strict";
        return {
            request: function (config) {
                var delayedRequest = $q.defer();

                if (config) {
                    config.headers = config.headers || {};

                    // if the request can be served via templateCache, no need to token
                    if ($templateCache.get(config.url)) return config;

                    var resource = authService.getScopeForEndpoint(config.url);
                    authService.verbose('Url: ' + config.url + ' maps to resource: ' + resource);
                    if (resource === null) {
                        return config;
                    }
                    var tokenStored = authService.acquireTokenSilent([resource]).then(
                        function (tokenStored) {
                            authService.info('Token is available for this url ' + config.url);
                            // check endpoint mapping if provided
                            config.headers.Authorization = 'Bearer ' + tokenStored;
                            delayedRequest.resolve(config);
                        }, function (error) {
                            if (authService.loginInProgress()) {
                                // Cancel request if login is starting
                                if (authService.config.popUp) {
                                    authService.info('Url: ' + config.url + ' will be loaded after login is successful');
                                    var delayedRequest = $q.defer();
                                    $rootScope.$on('msal:loginSuccess', function (event, token) {
                                        if (token) {
                                            authService.info('Login completed, sending request for ' + config.url);
                                            config.headers.Authorization = 'Bearer ' + tokenStored;
                                            delayedRequest.resolve(config);
                                        }
                                    });
                                    return delayedRequest.promise;
                                }
                                else {
                                    authService.info('login is in progress.');
                                    config.data = 'login in progress, cancelling the request for ' + config.url;
                                    return $q.reject(config);
                                }
                            } else {
                                // delayed request to return after iframe completes
                                authService.acquireToken(resource).then(function (token) {
                                    authService.verbose('Token is available');
                                    config.headers.Authorization = 'Bearer ' + token;
                                    delayedRequest.resolve(config);
                                }, function (error) {
                                    config.data = error;
                                    delayedRequest.reject(config);
                                });

                            }
                        }
                    );
                }
                return delayedRequest.promise;
            },
            responseError: function (rejection) {
                authService.info('Getting error in the response: ' + JSON.stringify(rejection));
                if (rejection) {
                    if (rejection.status === 401) {
                        var resource = authService.getScopeForEndpoint(rejection.config.url);
                        //TODO: check
                        // authService.clearCache(resource);
                        $rootScope.$broadcast('msal:notAuthorized', rejection, resource);
                    }
                    else {
                        $rootScope.$broadcast('msal:errorResponse', rejection);
                    }
                    return $q.reject(rejection);
                }
            }
        };
    }]