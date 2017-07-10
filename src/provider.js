export default function msalAuthenticationService() {
    "use strict";

    var msal = window.Msal;
    var forEach = require("angular").forEach;
    var _msal = null;
    var constants = msal.Constants;
    var _oauthData = {
        isAuthenticated: false,
        displayableId: '',
        identityProvider: '',
        name: '',
        userIdentifier: '',
        loginError: '',
        profile: undefined
    };
    var config = {};

    var updateDataFromCache = function () {
        let tempUser = _msal.getUser();
        // only cache lookup here to not interrupt with events
        var token = _msal.acquireTokenSilent([config.clientId], config.authority, tempUser).then(function (token) {
            _oauthData.isAuthenticated = token !== null && token.length > 0;
            var user = _msal.getUser() || {name: ''};
            _oauthData.displayableId = user.displayableId;
            _oauthData.identityProvider = user.identityProvider;
            _oauthData.name = user.name;
            _oauthData.userIdentifier = user.userIdentifier;
            _oauthData.profile = window.Msal.Utils.extractIdToken(token);
            _oauthData.loginError = '';
        }, function (err) {
            _oauthData.isAuthenticated = false;
            var user = _msal.getUser() || {name: ''};
            _oauthData.displayableId = user.displayableId;
            _oauthData.identityProvider = user.identityProvider;
            _oauthData.name = user.name;
            _oauthData.userIdentifier = user.userIdentifier;
            _oauthData.profile = undefined;
            _oauthData.loginError = err;
        });

    };

    this.init = function (_config, httpProvider = undefined) {
        if (httpProvider && httpProvider.interceptors) {
            httpProvider.interceptors.push('ProtectedResourceInterceptor');
        }
        config = _config;

        // create instance with given config
        _msal = new msal.UserAgentApplication(config.clientId, config.authority, config.callback, config.validateAuthority);
        if (config.redirectUri) {
            _msal.redirectUri = config.redirectUri;
        }
        if (config.postLogoutredirectUri) {
            _msal.postLogoutredirectUri = config.postLogoutredirectUri;
        }

        // loginResource is used to set authenticated status
        updateDataFromCache();
    };

    // special function that exposes methods in Angular controller
    // $rootScope, $window, $q, $location, $timeout are injected by Angular
    this['$get'] = ['$rootScope', '$window', '$q', '$location', '$timeout', '$injector', function ($rootScope, $window, $q, $location, $timeout, $injector) {

        var locationChangeHandler = function (event, newUrl, oldUrl) {
            msal.Logger("Verbose", 'Location change event from ' + oldUrl + ' to ' + newUrl);
            var hash;
            if ($location.$$html5) {
                hash = $location.hash();
            }
            else {
                hash = '#' + $location.path();
            }
            processHash(hash, event);

            $timeout(function () {
                updateDataFromCache();
                $rootScope.userInfo = _oauthData;
            }, 1);
        };

        var processHash = function (hash, event) {
            if (_msal.isCallback(hash)) {
                // callback can come from login or iframe request
                msal.Logger("Verbose", 'Processing the hash: ' + hash);
                var requestInfo = _msal.getRequestInfo(hash);
                _msal.saveTokenFromHash(requestInfo);
                // Return to callback if it is sent from iframe
                if (requestInfo.stateMatch) {
                    if (requestInfo.requestType === _msal.REQUEST_TYPE.RENEW_TOKEN) {
                        _msal._renewActive = false;
                        var callback = $window.parent.callBackMappedToRenewStates[requestInfo.stateResponse] || _msal.callback;
                        // since this is a token renewal request in iFrame, we don't need to proceed with the location change.
                        if (event && event.preventDefault) {
                            if (window.parent !== window) {//if token renewal request is made in an iframe
                                event.preventDefault();
                            }
                        }

                        // Call within the same context without full page redirect keeps the callback
                        if (callback && typeof callback === 'function') {
                            // id_token or access_token can be renewed
                            var token = requestInfo.parameters['access_token'] || requestInfo.parameters['id_token'];
                            var error = requestInfo.parameters['error'];
                            var errorDescription = requestInfo.parameters['error_description'];
                            if ($window.parent === $window && !$window.parent.callBackMappedToRenewStates[requestInfo.stateResponse]) {
                                if (token) {
                                    $rootScope.$broadcast('msal:acquireTokenSuccess', token);
                                }
                                else if (error && errorDescription) {
                                    $rootScope.$broadcast('msal:acquireTokenFailure', error, errorDescription);
                                }
                            }
                            callback(errorDescription, token, error);
                            if (window.parent !== window) {//in iframe
                                return;
                            }
                        }
                    } else if (requestInfo.requestType === _msal.REQUEST_TYPE.LOGIN) {
                        // normal full login redirect happened on the page
                        updateDataFromCache();
                        if (_oauthData.userIdentifier) {
                            $timeout(function () {
                                // id_token is added as token for the app
                                updateDataFromCache();
                                $rootScope.userInfo = _oauthData;
                            }, 1);

                            $rootScope.$broadcast('msal:loginSuccess', _msal._getItem(constants.Storage.idToken));
                        } else {
                            $rootScope.$broadcast('msal:loginFailure', _msal._getItem(constants.ErrorDescription), _msal._getItem(constants.Error));
                        }

                        if (_msal.callback && typeof _msal.callback === 'function')
                            _msal.callback(_msal._getItem(constants.ErrorDescription), _msal._getItem(constants.idToken), _msal._getItem(constants.Error));
                    }
                    // redirect to login start page
                    if (!_msal.popUp && window.parent === window) {
                        if (_msal.config.navigateToLoginRequestUrl) {
                            var loginStartPage = _msal._getItem(_msal.CONSTANTS.STORAGE.LOGIN_REQUEST);
                            if (typeof loginStartPage !== 'undefined' && loginStartPage && loginStartPage.length !== 0) {
                                // prevent the current location change and redirect the user back to the login start page
                                msal.Logger("Verbose", 'Redirecting to start page: ' + loginStartPage);
                                if (!$location.$$html5 && loginStartPage.indexOf('#') > -1) {
                                    $location.url(loginStartPage.substring(loginStartPage.indexOf('#') + 1));
                                }
                                $window.location.href = loginStartPage;
                            }
                        }
                        else {
                            // resetting the hash to null
                            if ($location.$$html5) {
                                $location.hash('');
                            }
                            else {
                                $location.path('');
                            }
                        }
                    }
                }
                else {
                    // state did not match, broadcast an error
                    $rootScope.$broadcast('msal:stateMismatch', _msal._getItem(_msal.CONSTANTS.STORAGE.ERROR_DESCRIPTION), _msal._getItem(_msal.CONSTANTS.STORAGE.ERROR));
                }
            } else {
                // No callback. App resumes after closing or moving to new page.
                // Check token and username
                updateDataFromCache();
                if (!_oauthData.isAuthenticated && _oauthData.userName && !_msal._renewActive) {
                    // id_token is expired or not present
                    var self = $injector.get('msalAuthenticationService');
                    self.acquireToken(_msal.config.loginResource).then(function (token) {
                        if (token) {
                            _oauthData.isAuthenticated = true;
                        }
                    }, function (error) {
                        var errorParts = error.split('|');
                        $rootScope.$broadcast('msal:loginFailure', errorParts[0], errorParts[1]);
                    });
                }
            }

        };

        var loginHandler = function () {
            msal.Logger("Info", 'Login event for:' + $location.$$url);
            if (_msal.config && _msal.config.localLoginUrl) {
                $location.path(_msal.config.localLoginUrl);
            }
            else {
                // directly start login flow
                msal.Logger("Info", 'Start login at:' + $location.$$absUrl);
                $rootScope.$broadcast('msal:loginRedirect');
                _msal.login($location.$$absUrl);
            }
        };

        function isADLoginRequired(route, global) {
            return global.requireADLogin ? route.requireADLogin !== false : !!route.requireADLogin;
        }

        function isAnonymousEndpoint(url) {
            if (config && config.anonymousEndpoints) {
                for (var i = 0; i < _msal.config.anonymousEndpoints.length; i++) {
                    if (url.indexOf(_msal.config.anonymousEndpoints[i]) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        function getStates(toState) {
            var state = null;
            var states = [];
            if (toState.hasOwnProperty('parent')) {
                state = toState;
                while (state) {
                    states.unshift(state);
                    state = $injector.get('$state').get(state.parent);
                }
            }
            else {
                var stateNames = toState.name.split('.');
                for (var i = 0, stateName = stateNames[0]; i < stateNames.length; i++) {
                    state = $injector.get('$state').get(stateName);
                    if (state) {
                        states.push(state);
                    }
                    stateName += '.' + stateNames[i + 1];
                }
            }
            return states;
        }

        var routeChangeHandler = function (e, nextRoute) {
            if (nextRoute && nextRoute.$$route) {
                if (isADLoginRequired(nextRoute.$$route, _msal.config)) {
                    if (!_oauthData.isAuthenticated) {
                        if (!_msal._renewActive && !_msal.loginInProgress()) {
                            msal.Logger("Info", 'Route change event for:' + $location.$$url);
                            loginHandler();
                        }
                    }
                }
                else {
                    var nextRouteUrl;
                    if (typeof nextRoute.$$route.templateUrl === "function") {
                        nextRouteUrl = nextRoute.$$route.templateUrl(nextRoute.params);
                    } else {
                        nextRouteUrl = nextRoute.$$route.templateUrl;
                    }
                    if (nextRouteUrl && !isAnonymousEndpoint(nextRouteUrl)) {
                        _msal.config.anonymousEndpoints.push(nextRouteUrl);
                    }
                }
            }
        };

        var stateChangeHandler = function (e, toState, toParams, fromState, fromParams) {
            if (toState) {
                var states = getStates(toState);
                var state = null;
                for (var i = 0; i < states.length; i++) {
                    state = states[i];
                    if (isADLoginRequired(state, _msal.config)) {
                        if (!_oauthData.isAuthenticated) {
                            if (!_msal._renewActive && !_msal.loginInProgress()) {
                                msal.Logger('Info', 'State change event for:' + $location.$$url);
                                loginHandler();
                            }
                        }
                    }
                    else if (state.templateUrl) {
                        var nextStateUrl;
                        if (typeof state.templateUrl === 'function') {
                            nextStateUrl = state.templateUrl(toParams);
                        }
                        else {
                            nextStateUrl = state.templateUrl;
                        }
                        if (nextStateUrl && !isAnonymousEndpoint(nextStateUrl)) {
                            _msal.config.anonymousEndpoints.push(nextStateUrl);
                        }
                    }
                }
            }
        };

        var stateChangeErrorHandler = function (event, toState, toParams, fromState, fromParams, error) {
            msal.Logger("Verbose", "State change error occured. Error: " + JSON.stringify(error));

            // msal interceptor sets the error on config.data property. If it is set, it means state change is rejected by msal,
            // in which case set the defaultPrevented to true to avoid url update as that sometimesleads to infinte loop.
            if (error && error.data) {
                msal.Logger("Info", "Setting defaultPrevented to true if state change error occured because msal rejected a request. Error: " + error.data);
                event.preventDefault();
            }
        };

        // Route change event tracking to receive fragment and also auto renew tokens
        $rootScope.$on('$routeChangeStart', routeChangeHandler);

        $rootScope.$on('$stateChangeStart', stateChangeHandler);

        $rootScope.$on('$locationChangeStart', locationChangeHandler);

        $rootScope.$on('$stateChangeError', stateChangeErrorHandler);

        //Event to track hash change of
        $window.addEventListener('msal:popUpHashChanged', function (e) {
            processHash(e.detail);
        });

        updateDataFromCache();
        $rootScope.userInfo = _oauthData;

        return {
            // public methods will be here that are accessible from Controller
            config: config,
            loginRedirect: function (loginScope = config.loginScope, extraQueryParameters = config.extraQueryParameters) {

                if (config.endpoints) {
                    forEach(config.endpoints, function (scope, endpoint) {
                        var foundInLoginScope = false;
                        loginScope.forEach(function (loginScopeItem) {
                            if (!foundInLoginScope) {
                                if (loginScopeItem === scope) {
                                    foundInLoginScope = true;
                                }
                            }
                        });
                        if (!foundInLoginScope) {
                            loginScope.push(scope);
                        }
                    });
                }
                _msal.loginRedirect(loginScope, extraQueryParameters);
            },
            loginPopup: function () {
                _msal.loginPopup(config.loginScope);

            },
            loginInProgress: function () {
                return _msal._loginInProgress;
            },
            logout: function () {
                _msal.logout();
                //call signout related method
            }, logOut: function () {
                _msal.logout();
                //call signout related method
            },
            getCachedToken: function (authenticationRequest, user = _msal.getUser()) {
                return _msal.getCachedToken(authenticationRequest, user);
            },
            userInfo: _oauthData,
            acquireTokenSilent: function (scopes, authority = undefined, user = undefined, extraQueryParameters = undefined) {
                // automated token request call
                var deferred = $q.defer();
                _msal._renewActive = true;
                _msal.acquireTokenSilent(scopes, authority, user, extraQueryParameters).then(function (tokenOut) {
                    _msal._renewActive = false;
                    $rootScope.$broadcast('msal:acquireTokenSuccess', tokenOut);
                    deferred.resolve(tokenOut);

                }, function (err) {
                    var errorDesc = err.split(':')[0];
                    var error = err.split(':')[1];
                    $rootScope.$broadcast('msal:acquireTokenFailure', errorDesc, error);
                    msal.Logger('Error', 'Error when acquiring token for scopes: ' + scopes, error);
                    deferred.reject(errorDesc + "|" + error);
                });

                return deferred.promise;
            },

            acquireTokenPopup: function (scopes, authority = undefined, user = undefined, extraQueryParameters = undefined) {
                var deferred = $q.defer();
                _msal.acquireTokenPopup(scopes, authority, user, extraQueryParameters).then(function (token) {
                    $rootScope.$broadcast('msal:acquireTokenSuccess', token);
                    deferred.resolve(token);
                }, function (err) {
                    var errorDesc = err.split(':')[0];
                    var error = err.split(':')[1];
                    $rootScope.$broadcast('msal:acquireTokenFailure', errorDesc, error);
                    msal.Logger('Error', 'Error when acquiring token for scopes: ' + scopes, error);
                    deferred.reject(errorDesc + "|" + error);
                });
                return deferred.promise;
            },

            acquireTokenRedirect: function (scopes, authority = undefined, user = undefined, extraQueryParameters = undefined) {
                _msal.acquireTokenRedirect(scopes, authority, user, extraQueryParameters);
            },

            getUser: function () {
                return _msal.getUser();
            },
            getScopeForEndpoint: function (requestUrl) {
                var resolvedScope = null;

                forEach(config.endpoints, function (scope, endpoint) {
                    if (!resolvedScope) {
                        if (requestUrl.indexOf(endpoint) > -1) {
                            resolvedScope = scope;
                        }
                    }
                });

                return resolvedScope;

                // return _msal.getResourceForEndpoint(endpoint);
            },
            clearCache: function () {
                _msal.clearCache();
            },
            info: function (message) {
                msal.Logger("Info", message, false);
            },
            verbose: function (message) {
                msal.Logger("Verbose", message, false);
            }
        };
    }];
}