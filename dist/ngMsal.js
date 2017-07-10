(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("msal"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "msal"], factory);
	else if(typeof exports === 'object')
		exports["ngMsal"] = factory(require("angular"), require("msal"));
	else
		root["ngMsal"] = factory(root["angular"], root["msal"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//----------------------------------------------------------------------
	// ngMsal v0.1.1
	// @preserve Copyright (c) Ward Gubbi & Microsoft Open Technologies, Inc.
	// All Rights Reserved
	//----------------------------------------------------------------------
	
	'use strict';
	
	'format amd';
	/* global define */
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	(function () {
	    // ============= Angular modules- Start =============
	    'use strict';
	
	    function ngMsal(angular, msal) {
	
	        var library = {
	            angular: angular, msal: msal
	        };
	
	        if (!window.Msal) {
	            throw new Error('Msal cannot be found by ngMsal. Msal not available globally.'); // Add wiki/troubleshooting section?
	            //Issue with msal, cannot import
	        } else if (msal !== window.Msal) {
	                msal = window.Msal;
	            }
	
	        if (angular) {
	            var ngMsal = angular.module('ngMsal', []).provider('msalAuthenticationService', __webpack_require__(1)['default']).factory('ProtectedResourceInterceptor', __webpack_require__(3)['default']);
	            return ngMsal.name;
	        } else {
	            window.console.error('Angular.JS is not included');
	        }
	
	        return 'ngMsal';
	    }
	
	    var isElectron = window && window.process && window.process.type;
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (ngMsal), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module && module.exports && typeof require === 'function' && !isElectron) {
	        module.exports = ngMsal(require('angular'), require('msal'));
	    } else {
	        ngMsal(angular, (typeof global !== 'undefined' ? global : window).Msal);
	    }
	})();
	
	exports['default'] = 'ngMsal';
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	function msalAuthenticationService() {
	    "use strict";
	
	    var msal = window.Msal;
	    var forEach = __webpack_require__(2).forEach;
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
	
	    var updateDataFromCache = function updateDataFromCache() {
	        var tempUser = _msal.getUser();
	        // only cache lookup here to not interrupt with events
	        var token = _msal.acquireTokenSilent([config.clientId], config.authority, tempUser).then(function (token) {
	            _oauthData.isAuthenticated = token !== null && token.length > 0;
	            var user = _msal.getUser() || { name: '' };
	            _oauthData.displayableId = user.displayableId;
	            _oauthData.identityProvider = user.identityProvider;
	            _oauthData.name = user.name;
	            _oauthData.userIdentifier = user.userIdentifier;
	            _oauthData.profile = window.Msal.Utils.extractIdToken(token);
	            _oauthData.loginError = '';
	        }, function (err) {
	            _oauthData.isAuthenticated = false;
	            var user = _msal.getUser() || { name: '' };
	            _oauthData.displayableId = user.displayableId;
	            _oauthData.identityProvider = user.identityProvider;
	            _oauthData.name = user.name;
	            _oauthData.userIdentifier = user.userIdentifier;
	            _oauthData.profile = undefined;
	            _oauthData.loginError = err;
	        });
	    };
	
	    this.init = function (_config) {
	        var httpProvider = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
	
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
	
	        var locationChangeHandler = function locationChangeHandler(event, newUrl, oldUrl) {
	            msal.Logger("Verbose", 'Location change event from ' + oldUrl + ' to ' + newUrl);
	            var hash;
	            if ($location.$$html5) {
	                hash = $location.hash();
	            } else {
	                hash = '#' + $location.path();
	            }
	            processHash(hash, event);
	
	            $timeout(function () {
	                updateDataFromCache();
	                $rootScope.userInfo = _oauthData;
	            }, 1);
	        };
	
	        var processHash = function processHash(hash, event) {
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
	                            if (window.parent !== window) {
	                                //if token renewal request is made in an iframe
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
	                                } else if (error && errorDescription) {
	                                    $rootScope.$broadcast('msal:acquireTokenFailure', error, errorDescription);
	                                }
	                            }
	                            callback(errorDescription, token, error);
	                            if (window.parent !== window) {
	                                //in iframe
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
	
	                        if (_msal.callback && typeof _msal.callback === 'function') _msal.callback(_msal._getItem(constants.ErrorDescription), _msal._getItem(constants.idToken), _msal._getItem(constants.Error));
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
	                        } else {
	                            // resetting the hash to null
	                            if ($location.$$html5) {
	                                $location.hash('');
	                            } else {
	                                $location.path('');
	                            }
	                        }
	                    }
	                } else {
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
	
	        var loginHandler = function loginHandler() {
	            msal.Logger("Info", 'Login event for:' + $location.$$url);
	            if (_msal.config && _msal.config.localLoginUrl) {
	                $location.path(_msal.config.localLoginUrl);
	            } else {
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
	            } else {
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
	
	        var routeChangeHandler = function routeChangeHandler(e, nextRoute) {
	            if (nextRoute && nextRoute.$$route) {
	                if (isADLoginRequired(nextRoute.$$route, _msal.config)) {
	                    if (!_oauthData.isAuthenticated) {
	                        if (!_msal._renewActive && !_msal.loginInProgress()) {
	                            msal.Logger("Info", 'Route change event for:' + $location.$$url);
	                            loginHandler();
	                        }
	                    }
	                } else {
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
	
	        var stateChangeHandler = function stateChangeHandler(e, toState, toParams, fromState, fromParams) {
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
	                    } else if (state.templateUrl) {
	                        var nextStateUrl;
	                        if (typeof state.templateUrl === 'function') {
	                            nextStateUrl = state.templateUrl(toParams);
	                        } else {
	                            nextStateUrl = state.templateUrl;
	                        }
	                        if (nextStateUrl && !isAnonymousEndpoint(nextStateUrl)) {
	                            _msal.config.anonymousEndpoints.push(nextStateUrl);
	                        }
	                    }
	                }
	            }
	        };
	
	        var stateChangeErrorHandler = function stateChangeErrorHandler(event, toState, toParams, fromState, fromParams, error) {
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
	            loginRedirect: function loginRedirect() {
	                var loginScope = arguments.length <= 0 || arguments[0] === undefined ? config.loginScope : arguments[0];
	                var extraQueryParameters = arguments.length <= 1 || arguments[1] === undefined ? config.extraQueryParameters : arguments[1];
	
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
	            loginPopup: function loginPopup() {
	                _msal.loginPopup(config.loginScope);
	            },
	            loginInProgress: function loginInProgress() {
	                return _msal._loginInProgress;
	            },
	            logout: function logout() {
	                _msal.logout();
	                //call signout related method
	            }, logOut: function logOut() {
	                _msal.logout();
	                //call signout related method
	            },
	            getCachedToken: function getCachedToken(authenticationRequest) {
	                var user = arguments.length <= 1 || arguments[1] === undefined ? _msal.getUser() : arguments[1];
	
	                return _msal.getCachedToken(authenticationRequest, user);
	            },
	            userInfo: _oauthData,
	            acquireTokenSilent: function acquireTokenSilent(scopes) {
	                var authority = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
	                var user = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
	                var extraQueryParameters = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
	
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
	
	            acquireTokenPopup: function acquireTokenPopup(scopes) {
	                var authority = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
	                var user = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
	                var extraQueryParameters = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
	
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
	
	            acquireTokenRedirect: function acquireTokenRedirect(scopes) {
	                var authority = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
	                var user = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
	                var extraQueryParameters = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];
	
	                _msal.acquireTokenRedirect(scopes, authority, user, extraQueryParameters);
	            },
	
	            getUser: function getUser() {
	                return _msal.getUser();
	            },
	            getScopeForEndpoint: function getScopeForEndpoint(requestUrl) {
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
	            clearCache: function clearCache() {
	                _msal.clearCache();
	            },
	            info: function info(message) {
	                msal.Logger("Info", message, false);
	            },
	            verbose: function verbose(message) {
	                msal.Logger("Verbose", message, false);
	            }
	        };
	    }];
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("angular");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// Interceptor for http if needed
	'use strict';
	
	['msalAuthenticationService', '$q', '$rootScope', '$templateCache', function protectedResourceInterceptor(authService, $q, $rootScope, $templateCache) {
	    "use strict";
	    return {
	        request: function request(config) {
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
	                var tokenStored = authService.acquireTokenSilent([resource]).then(function (tokenStored) {
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
	                        } else {
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
	                });
	            }
	            return delayedRequest.promise;
	        },
	        responseError: function responseError(rejection) {
	            authService.info('Getting error in the response: ' + JSON.stringify(rejection));
	            if (rejection) {
	                if (rejection.status === 401) {
	                    var resource = authService.getScopeForEndpoint(rejection.config.url);
	                    //TODO: check
	                    // authService.clearCache(resource);
	                    $rootScope.$broadcast('msal:notAuthorized', rejection, resource);
	                } else {
	                    $rootScope.$broadcast('msal:errorResponse', rejection);
	                }
	                return $q.reject(rejection);
	            }
	        }
	    };
	}];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("msal");

/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0MTViMDliOWNmMTZhN2MzZjk1OSIsIndlYnBhY2s6Ly8vLi9zcmMvbXNhbC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3ZpZGVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFuZ3VsYXJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvaW50ZXJjZXB0b3IuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXNhbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDaENBLGFBQVksQ0FBQzs7Ozs7O0FBR1osY0FBWTs7QUFFVCxpQkFBWSxDQUFDOztBQUViLGNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7O0FBRTNCLGFBQUksT0FBTyxHQUFHO0FBQ1Ysb0JBQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUk7VUFDaEI7O0FBRUQsYUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDZCxtQkFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztVQUVuRixNQUNJLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDM0IscUJBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2NBQ3RCOztBQUVELGFBQUksT0FBTyxFQUFFO0FBQ1QsaUJB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OztBQzlFTixrQyIsImZpbGUiOiJkaXN0L25nTXNhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImFuZ3VsYXJcIiksIHJlcXVpcmUoXCJtc2FsXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImFuZ3VsYXJcIiwgXCJtc2FsXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm5nTXNhbFwiXSA9IGZhY3RvcnkocmVxdWlyZShcImFuZ3VsYXJcIiksIHJlcXVpcmUoXCJtc2FsXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJuZ01zYWxcIl0gPSBmYWN0b3J5KHJvb3RbXCJhbmd1bGFyXCJdLCByb290W1wibXNhbFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV80X18pIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDE1YjA5YjljZjE2YTdjM2Y5NTkiLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIG5nTXNhbCB2MC4xLjFcbi8vIEBwcmVzZXJ2ZSBDb3B5cmlnaHQgKGMpIFdhcmQgR3ViYmkgJiBNaWNyb3NvZnQgT3BlbiBUZWNobm9sb2dpZXMsIEluYy5cbi8vIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4nZm9ybWF0IGFtZCc7XG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgLy8gPT09PT09PT09PT09PSBBbmd1bGFyIG1vZHVsZXMtIFN0YXJ0ID09PT09PT09PT09PT1cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBmdW5jdGlvbiBuZ01zYWwoYW5ndWxhciwgbXNhbCkge1xuXG4gICAgICAgIHZhciBsaWJyYXJ5ID0ge1xuICAgICAgICAgICAgYW5ndWxhciwgbXNhbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aW5kb3cuTXNhbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNc2FsIGNhbm5vdCBiZSBmb3VuZCBieSBuZ01zYWwuIE1zYWwgbm90IGF2YWlsYWJsZSBnbG9iYWxseS4nKTsgLy8gQWRkIHdpa2kvdHJvdWJsZXNob290aW5nIHNlY3Rpb24/XG4gICAgICAgICAgICAvL0lzc3VlIHdpdGggbXNhbCwgY2Fubm90IGltcG9ydFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1zYWwgIT09IHdpbmRvdy5Nc2FsKSB7XG4gICAgICAgICAgICBtc2FsID0gd2luZG93Lk1zYWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5ndWxhcikge1xuICAgICAgICAgICAgdmFyIG5nTXNhbCA9IGFuZ3VsYXIubW9kdWxlKCduZ01zYWwnLCBbXSlcbiAgICAgICAgICAgICAgICAucHJvdmlkZXIoJ21zYWxBdXRoZW50aWNhdGlvblNlcnZpY2UnLCByZXF1aXJlKFwiLi9wcm92aWRlclwiKS5kZWZhdWx0KVxuICAgICAgICAgICAgICAgIC5mYWN0b3J5KCdQcm90ZWN0ZWRSZXNvdXJjZUludGVyY2VwdG9yJywgcmVxdWlyZShcIi4vaW50ZXJjZXB0b3JcIikuZGVmYXVsdCk7XG4gICAgICAgICAgICByZXR1cm4gbmdNc2FsLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcignQW5ndWxhci5KUyBpcyBub3QgaW5jbHVkZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnbmdNc2FsJztcbiAgICB9XG5cbiAgICB2YXIgaXNFbGVjdHJvbiA9IHdpbmRvdyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFsnYW5ndWxhcicsICdtc2FsJ10sIG5nTXNhbCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMgJiYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nKSAmJiAhaXNFbGVjdHJvbikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG5nTXNhbChyZXF1aXJlKCdhbmd1bGFyJyksIHJlcXVpcmUoJ21zYWwnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmdNc2FsKGFuZ3VsYXIsICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHdpbmRvdykuTXNhbCk7XG4gICAgfVxuXG5cbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0ICduZ01zYWwnO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tc2FsLm1vZHVsZS5qcyIsImZ1bmN0aW9uIG1zYWxBdXRoZW50aWNhdGlvblNlcnZpY2UoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgbXNhbCA9IHdpbmRvdy5Nc2FsO1xuICAgIHZhciBmb3JFYWNoID0gcmVxdWlyZShcImFuZ3VsYXJcIikuZm9yRWFjaDtcbiAgICB2YXIgX21zYWwgPSBudWxsO1xuICAgIHZhciBjb25zdGFudHMgPSBtc2FsLkNvbnN0YW50cztcbiAgICB2YXIgX29hdXRoRGF0YSA9IHtcbiAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgICAgZGlzcGxheWFibGVJZDogJycsXG4gICAgICAgIGlkZW50aXR5UHJvdmlkZXI6ICcnLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgdXNlcklkZW50aWZpZXI6ICcnLFxuICAgICAgICBsb2dpbkVycm9yOiAnJyxcbiAgICAgICAgcHJvZmlsZTogdW5kZWZpbmVkXG4gICAgfTtcbiAgICB2YXIgY29uZmlnID0ge307XG5cbiAgICB2YXIgdXBkYXRlRGF0YUZyb21DYWNoZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRlbXBVc2VyID0gX21zYWwuZ2V0VXNlcigpO1xuICAgICAgICAvLyBvbmx5IGNhY2hlIGxvb2t1cCBoZXJlIHRvIG5vdCBpbnRlcnJ1cHQgd2l0aCBldmVudHNcbiAgICAgICAgdmFyIHRva2VuID0gX21zYWwuYWNxdWlyZVRva2VuU2lsZW50KFtjb25maWcuY2xpZW50SWRdLCBjb25maWcuYXV0aG9yaXR5LCB0ZW1wVXNlcikudGhlbihmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuaXNBdXRoZW50aWNhdGVkID0gdG9rZW4gIT09IG51bGwgJiYgdG9rZW4ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHZhciB1c2VyID0gX21zYWwuZ2V0VXNlcigpIHx8IHtuYW1lOiAnJ307XG4gICAgICAgICAgICBfb2F1dGhEYXRhLmRpc3BsYXlhYmxlSWQgPSB1c2VyLmRpc3BsYXlhYmxlSWQ7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLmlkZW50aXR5UHJvdmlkZXIgPSB1c2VyLmlkZW50aXR5UHJvdmlkZXI7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLnVzZXJJZGVudGlmaWVyID0gdXNlci51c2VySWRlbnRpZmllcjtcbiAgICAgICAgICAgIF9vYXV0aERhdGEucHJvZmlsZSA9IHdpbmRvdy5Nc2FsLlV0aWxzLmV4dHJhY3RJZFRva2VuKHRva2VuKTtcbiAgICAgICAgICAgIF9vYXV0aERhdGEubG9naW5FcnJvciA9ICcnO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLmlzQXV0aGVudGljYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIHVzZXIgPSBfbXNhbC5nZXRVc2VyKCkgfHwge25hbWU6ICcnfTtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuZGlzcGxheWFibGVJZCA9IHVzZXIuZGlzcGxheWFibGVJZDtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuaWRlbnRpdHlQcm92aWRlciA9IHVzZXIuaWRlbnRpdHlQcm92aWRlcjtcbiAgICAgICAgICAgIF9vYXV0aERhdGEubmFtZSA9IHVzZXIubmFtZTtcbiAgICAgICAgICAgIF9vYXV0aERhdGEudXNlcklkZW50aWZpZXIgPSB1c2VyLnVzZXJJZGVudGlmaWVyO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5wcm9maWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5sb2dpbkVycm9yID0gZXJyO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbiAoX2NvbmZpZywgaHR0cFByb3ZpZGVyID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChodHRwUHJvdmlkZXIgJiYgaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycykge1xuICAgICAgICAgICAgaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdQcm90ZWN0ZWRSZXNvdXJjZUludGVyY2VwdG9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnID0gX2NvbmZpZztcblxuICAgICAgICAvLyBjcmVhdGUgaW5zdGFuY2Ugd2l0aCBnaXZlbiBjb25maWdcbiAgICAgICAgX21zYWwgPSBuZXcgbXNhbC5Vc2VyQWdlbnRBcHBsaWNhdGlvbihjb25maWcuY2xpZW50SWQsIGNvbmZpZy5hdXRob3JpdHksIGNvbmZpZy5jYWxsYmFjaywgY29uZmlnLnZhbGlkYXRlQXV0aG9yaXR5KTtcbiAgICAgICAgaWYgKGNvbmZpZy5yZWRpcmVjdFVyaSkge1xuICAgICAgICAgICAgX21zYWwucmVkaXJlY3RVcmkgPSBjb25maWcucmVkaXJlY3RVcmk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZpZy5wb3N0TG9nb3V0cmVkaXJlY3RVcmkpIHtcbiAgICAgICAgICAgIF9tc2FsLnBvc3RMb2dvdXRyZWRpcmVjdFVyaSA9IGNvbmZpZy5wb3N0TG9nb3V0cmVkaXJlY3RVcmk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsb2dpblJlc291cmNlIGlzIHVzZWQgdG8gc2V0IGF1dGhlbnRpY2F0ZWQgc3RhdHVzXG4gICAgICAgIHVwZGF0ZURhdGFGcm9tQ2FjaGUoKTtcbiAgICB9O1xuXG4gICAgLy8gc3BlY2lhbCBmdW5jdGlvbiB0aGF0IGV4cG9zZXMgbWV0aG9kcyBpbiBBbmd1bGFyIGNvbnRyb2xsZXJcbiAgICAvLyAkcm9vdFNjb3BlLCAkd2luZG93LCAkcSwgJGxvY2F0aW9uLCAkdGltZW91dCBhcmUgaW5qZWN0ZWQgYnkgQW5ndWxhclxuICAgIHRoaXNbJyRnZXQnXSA9IFsnJHJvb3RTY29wZScsICckd2luZG93JywgJyRxJywgJyRsb2NhdGlvbicsICckdGltZW91dCcsICckaW5qZWN0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHdpbmRvdywgJHEsICRsb2NhdGlvbiwgJHRpbWVvdXQsICRpbmplY3Rvcikge1xuXG4gICAgICAgIHZhciBsb2NhdGlvbkNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQsIG5ld1VybCwgb2xkVXJsKSB7XG4gICAgICAgICAgICBtc2FsLkxvZ2dlcihcIlZlcmJvc2VcIiwgJ0xvY2F0aW9uIGNoYW5nZSBldmVudCBmcm9tICcgKyBvbGRVcmwgKyAnIHRvICcgKyBuZXdVcmwpO1xuICAgICAgICAgICAgdmFyIGhhc2g7XG4gICAgICAgICAgICBpZiAoJGxvY2F0aW9uLiQkaHRtbDUpIHtcbiAgICAgICAgICAgICAgICBoYXNoID0gJGxvY2F0aW9uLmhhc2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhc2ggPSAnIycgKyAkbG9jYXRpb24ucGF0aCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvY2Vzc0hhc2goaGFzaCwgZXZlbnQpO1xuXG4gICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRGF0YUZyb21DYWNoZSgpO1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUudXNlckluZm8gPSBfb2F1dGhEYXRhO1xuICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHByb2Nlc3NIYXNoID0gZnVuY3Rpb24gKGhhc2gsIGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoX21zYWwuaXNDYWxsYmFjayhoYXNoKSkge1xuICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrIGNhbiBjb21lIGZyb20gbG9naW4gb3IgaWZyYW1lIHJlcXVlc3RcbiAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcihcIlZlcmJvc2VcIiwgJ1Byb2Nlc3NpbmcgdGhlIGhhc2g6ICcgKyBoYXNoKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdEluZm8gPSBfbXNhbC5nZXRSZXF1ZXN0SW5mbyhoYXNoKTtcbiAgICAgICAgICAgICAgICBfbXNhbC5zYXZlVG9rZW5Gcm9tSGFzaChyZXF1ZXN0SW5mbyk7XG4gICAgICAgICAgICAgICAgLy8gUmV0dXJuIHRvIGNhbGxiYWNrIGlmIGl0IGlzIHNlbnQgZnJvbSBpZnJhbWVcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdEluZm8uc3RhdGVNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdEluZm8ucmVxdWVzdFR5cGUgPT09IF9tc2FsLlJFUVVFU1RfVFlQRS5SRU5FV19UT0tFTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX21zYWwuX3JlbmV3QWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSAkd2luZG93LnBhcmVudC5jYWxsQmFja01hcHBlZFRvUmVuZXdTdGF0ZXNbcmVxdWVzdEluZm8uc3RhdGVSZXNwb25zZV0gfHwgX21zYWwuY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSB0aGlzIGlzIGEgdG9rZW4gcmVuZXdhbCByZXF1ZXN0IGluIGlGcmFtZSwgd2UgZG9uJ3QgbmVlZCB0byBwcm9jZWVkIHdpdGggdGhlIGxvY2F0aW9uIGNoYW5nZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudCAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHsvL2lmIHRva2VuIHJlbmV3YWwgcmVxdWVzdCBpcyBtYWRlIGluIGFuIGlmcmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2FsbCB3aXRoaW4gdGhlIHNhbWUgY29udGV4dCB3aXRob3V0IGZ1bGwgcGFnZSByZWRpcmVjdCBrZWVwcyB0aGUgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayAmJiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZF90b2tlbiBvciBhY2Nlc3NfdG9rZW4gY2FuIGJlIHJlbmV3ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSByZXF1ZXN0SW5mby5wYXJhbWV0ZXJzWydhY2Nlc3NfdG9rZW4nXSB8fCByZXF1ZXN0SW5mby5wYXJhbWV0ZXJzWydpZF90b2tlbiddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHJlcXVlc3RJbmZvLnBhcmFtZXRlcnNbJ2Vycm9yJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yRGVzY3JpcHRpb24gPSByZXF1ZXN0SW5mby5wYXJhbWV0ZXJzWydlcnJvcl9kZXNjcmlwdGlvbiddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkd2luZG93LnBhcmVudCA9PT0gJHdpbmRvdyAmJiAhJHdpbmRvdy5wYXJlbnQuY2FsbEJhY2tNYXBwZWRUb1JlbmV3U3RhdGVzW3JlcXVlc3RJbmZvLnN0YXRlUmVzcG9uc2VdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmFjcXVpcmVUb2tlblN1Y2Nlc3MnLCB0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyb3IgJiYgZXJyb3JEZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmFjcXVpcmVUb2tlbkZhaWx1cmUnLCBlcnJvciwgZXJyb3JEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3JEZXNjcmlwdGlvbiwgdG9rZW4sIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LnBhcmVudCAhPT0gd2luZG93KSB7Ly9pbiBpZnJhbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0SW5mby5yZXF1ZXN0VHlwZSA9PT0gX21zYWwuUkVRVUVTVF9UWVBFLkxPR0lOKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub3JtYWwgZnVsbCBsb2dpbiByZWRpcmVjdCBoYXBwZW5lZCBvbiB0aGUgcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRGF0YUZyb21DYWNoZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9vYXV0aERhdGEudXNlcklkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlkX3Rva2VuIGlzIGFkZGVkIGFzIHRva2VuIGZvciB0aGUgYXBwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZURhdGFGcm9tQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c2VySW5mbyA9IF9vYXV0aERhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6bG9naW5TdWNjZXNzJywgX21zYWwuX2dldEl0ZW0oY29uc3RhbnRzLlN0b3JhZ2UuaWRUb2tlbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6bG9naW5GYWlsdXJlJywgX21zYWwuX2dldEl0ZW0oY29uc3RhbnRzLkVycm9yRGVzY3JpcHRpb24pLCBfbXNhbC5fZ2V0SXRlbShjb25zdGFudHMuRXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9tc2FsLmNhbGxiYWNrICYmIHR5cGVvZiBfbXNhbC5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbXNhbC5jYWxsYmFjayhfbXNhbC5fZ2V0SXRlbShjb25zdGFudHMuRXJyb3JEZXNjcmlwdGlvbiksIF9tc2FsLl9nZXRJdGVtKGNvbnN0YW50cy5pZFRva2VuKSwgX21zYWwuX2dldEl0ZW0oY29uc3RhbnRzLkVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gcmVkaXJlY3QgdG8gbG9naW4gc3RhcnQgcGFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIV9tc2FsLnBvcFVwICYmIHdpbmRvdy5wYXJlbnQgPT09IHdpbmRvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9tc2FsLmNvbmZpZy5uYXZpZ2F0ZVRvTG9naW5SZXF1ZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvZ2luU3RhcnRQYWdlID0gX21zYWwuX2dldEl0ZW0oX21zYWwuQ09OU1RBTlRTLlNUT1JBR0UuTE9HSU5fUkVRVUVTVCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsb2dpblN0YXJ0UGFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9naW5TdGFydFBhZ2UgJiYgbG9naW5TdGFydFBhZ2UubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgdGhlIGN1cnJlbnQgbG9jYXRpb24gY2hhbmdlIGFuZCByZWRpcmVjdCB0aGUgdXNlciBiYWNrIHRvIHRoZSBsb2dpbiBzdGFydCBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiVmVyYm9zZVwiLCAnUmVkaXJlY3RpbmcgdG8gc3RhcnQgcGFnZTogJyArIGxvZ2luU3RhcnRQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkbG9jYXRpb24uJCRodG1sNSAmJiBsb2dpblN0YXJ0UGFnZS5pbmRleE9mKCcjJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnVybChsb2dpblN0YXJ0UGFnZS5zdWJzdHJpbmcobG9naW5TdGFydFBhZ2UuaW5kZXhPZignIycpICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGxvZ2luU3RhcnRQYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0dGluZyB0aGUgaGFzaCB0byBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRsb2NhdGlvbi4kJGh0bWw1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5oYXNoKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0YXRlIGRpZCBub3QgbWF0Y2gsIGJyb2FkY2FzdCBhbiBlcnJvclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6c3RhdGVNaXNtYXRjaCcsIF9tc2FsLl9nZXRJdGVtKF9tc2FsLkNPTlNUQU5UUy5TVE9SQUdFLkVSUk9SX0RFU0NSSVBUSU9OKSwgX21zYWwuX2dldEl0ZW0oX21zYWwuQ09OU1RBTlRTLlNUT1JBR0UuRVJST1IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5vIGNhbGxiYWNrLiBBcHAgcmVzdW1lcyBhZnRlciBjbG9zaW5nIG9yIG1vdmluZyB0byBuZXcgcGFnZS5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayB0b2tlbiBhbmQgdXNlcm5hbWVcbiAgICAgICAgICAgICAgICB1cGRhdGVEYXRhRnJvbUNhY2hlKCk7XG4gICAgICAgICAgICAgICAgaWYgKCFfb2F1dGhEYXRhLmlzQXV0aGVudGljYXRlZCAmJiBfb2F1dGhEYXRhLnVzZXJOYW1lICYmICFfbXNhbC5fcmVuZXdBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWRfdG9rZW4gaXMgZXhwaXJlZCBvciBub3QgcHJlc2VudFxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9ICRpbmplY3Rvci5nZXQoJ21zYWxBdXRoZW50aWNhdGlvblNlcnZpY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY3F1aXJlVG9rZW4oX21zYWwuY29uZmlnLmxvZ2luUmVzb3VyY2UpLnRoZW4oZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb2F1dGhEYXRhLmlzQXV0aGVudGljYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yUGFydHMgPSBlcnJvci5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmxvZ2luRmFpbHVyZScsIGVycm9yUGFydHNbMF0sIGVycm9yUGFydHNbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbG9naW5IYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJJbmZvXCIsICdMb2dpbiBldmVudCBmb3I6JyArICRsb2NhdGlvbi4kJHVybCk7XG4gICAgICAgICAgICBpZiAoX21zYWwuY29uZmlnICYmIF9tc2FsLmNvbmZpZy5sb2NhbExvZ2luVXJsKSB7XG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoX21zYWwuY29uZmlnLmxvY2FsTG9naW5VcmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0bHkgc3RhcnQgbG9naW4gZmxvd1xuICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiSW5mb1wiLCAnU3RhcnQgbG9naW4gYXQ6JyArICRsb2NhdGlvbi4kJGFic1VybCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmxvZ2luUmVkaXJlY3QnKTtcbiAgICAgICAgICAgICAgICBfbXNhbC5sb2dpbigkbG9jYXRpb24uJCRhYnNVcmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzQURMb2dpblJlcXVpcmVkKHJvdXRlLCBnbG9iYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwucmVxdWlyZUFETG9naW4gPyByb3V0ZS5yZXF1aXJlQURMb2dpbiAhPT0gZmFsc2UgOiAhIXJvdXRlLnJlcXVpcmVBRExvZ2luO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBbm9ueW1vdXNFbmRwb2ludCh1cmwpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLmFub255bW91c0VuZHBvaW50cykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX21zYWwuY29uZmlnLmFub255bW91c0VuZHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXJsLmluZGV4T2YoX21zYWwuY29uZmlnLmFub255bW91c0VuZHBvaW50c1tpXSkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRTdGF0ZXModG9TdGF0ZSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBzdGF0ZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICh0b1N0YXRlLmhhc093blByb3BlcnR5KCdwYXJlbnQnKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gdG9TdGF0ZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVzLnVuc2hpZnQoc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZSA9ICRpbmplY3Rvci5nZXQoJyRzdGF0ZScpLmdldChzdGF0ZS5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZU5hbWVzID0gdG9TdGF0ZS5uYW1lLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHN0YXRlTmFtZSA9IHN0YXRlTmFtZXNbMF07IGkgPCBzdGF0ZU5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gJGluamVjdG9yLmdldCgnJHN0YXRlJykuZ2V0KHN0YXRlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlTmFtZSArPSAnLicgKyBzdGF0ZU5hbWVzW2kgKyAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJvdXRlQ2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIChlLCBuZXh0Um91dGUpIHtcbiAgICAgICAgICAgIGlmIChuZXh0Um91dGUgJiYgbmV4dFJvdXRlLiQkcm91dGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBRExvZ2luUmVxdWlyZWQobmV4dFJvdXRlLiQkcm91dGUsIF9tc2FsLmNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfb2F1dGhEYXRhLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfbXNhbC5fcmVuZXdBY3RpdmUgJiYgIV9tc2FsLmxvZ2luSW5Qcm9ncmVzcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJJbmZvXCIsICdSb3V0ZSBjaGFuZ2UgZXZlbnQgZm9yOicgKyAkbG9jYXRpb24uJCR1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luSGFuZGxlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFJvdXRlVXJsO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5leHRSb3V0ZS4kJHJvdXRlLnRlbXBsYXRlVXJsID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRSb3V0ZVVybCA9IG5leHRSb3V0ZS4kJHJvdXRlLnRlbXBsYXRlVXJsKG5leHRSb3V0ZS5wYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFJvdXRlVXJsID0gbmV4dFJvdXRlLiQkcm91dGUudGVtcGxhdGVVcmw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRSb3V0ZVVybCAmJiAhaXNBbm9ueW1vdXNFbmRwb2ludChuZXh0Um91dGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbXNhbC5jb25maWcuYW5vbnltb3VzRW5kcG9pbnRzLnB1c2gobmV4dFJvdXRlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc3RhdGVDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gKGUsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh0b1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlcyA9IGdldFN0YXRlcyh0b1N0YXRlKTtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhdGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBRExvZ2luUmVxdWlyZWQoc3RhdGUsIF9tc2FsLmNvbmZpZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX29hdXRoRGF0YS5pc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9tc2FsLl9yZW5ld0FjdGl2ZSAmJiAhX21zYWwubG9naW5JblByb2dyZXNzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoJ0luZm8nLCAnU3RhdGUgY2hhbmdlIGV2ZW50IGZvcjonICsgJGxvY2F0aW9uLiQkdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5IYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0YXRlLnRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFN0YXRlVXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZS50ZW1wbGF0ZVVybCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZVVybCA9IHN0YXRlLnRlbXBsYXRlVXJsKHRvUGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZVVybCA9IHN0YXRlLnRlbXBsYXRlVXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRTdGF0ZVVybCAmJiAhaXNBbm9ueW1vdXNFbmRwb2ludChuZXh0U3RhdGVVcmwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX21zYWwuY29uZmlnLmFub255bW91c0VuZHBvaW50cy5wdXNoKG5leHRTdGF0ZVVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHN0YXRlQ2hhbmdlRXJyb3JIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJWZXJib3NlXCIsIFwiU3RhdGUgY2hhbmdlIGVycm9yIG9jY3VyZWQuIEVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG5cbiAgICAgICAgICAgIC8vIG1zYWwgaW50ZXJjZXB0b3Igc2V0cyB0aGUgZXJyb3Igb24gY29uZmlnLmRhdGEgcHJvcGVydHkuIElmIGl0IGlzIHNldCwgaXQgbWVhbnMgc3RhdGUgY2hhbmdlIGlzIHJlamVjdGVkIGJ5IG1zYWwsXG4gICAgICAgICAgICAvLyBpbiB3aGljaCBjYXNlIHNldCB0aGUgZGVmYXVsdFByZXZlbnRlZCB0byB0cnVlIHRvIGF2b2lkIHVybCB1cGRhdGUgYXMgdGhhdCBzb21ldGltZXNsZWFkcyB0byBpbmZpbnRlIGxvb3AuXG4gICAgICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IuZGF0YSkge1xuICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiSW5mb1wiLCBcIlNldHRpbmcgZGVmYXVsdFByZXZlbnRlZCB0byB0cnVlIGlmIHN0YXRlIGNoYW5nZSBlcnJvciBvY2N1cmVkIGJlY2F1c2UgbXNhbCByZWplY3RlZCBhIHJlcXVlc3QuIEVycm9yOiBcIiArIGVycm9yLmRhdGEpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUm91dGUgY2hhbmdlIGV2ZW50IHRyYWNraW5nIHRvIHJlY2VpdmUgZnJhZ21lbnQgYW5kIGFsc28gYXV0byByZW5ldyB0b2tlbnNcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0Jywgcm91dGVDaGFuZ2VIYW5kbGVyKTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBzdGF0ZUNoYW5nZUhhbmRsZXIpO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGxvY2F0aW9uQ2hhbmdlSGFuZGxlcik7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgc3RhdGVDaGFuZ2VFcnJvckhhbmRsZXIpO1xuXG4gICAgICAgIC8vRXZlbnQgdG8gdHJhY2sgaGFzaCBjaGFuZ2Ugb2ZcbiAgICAgICAgJHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtc2FsOnBvcFVwSGFzaENoYW5nZWQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgcHJvY2Vzc0hhc2goZS5kZXRhaWwpO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cGRhdGVEYXRhRnJvbUNhY2hlKCk7XG4gICAgICAgICRyb290U2NvcGUudXNlckluZm8gPSBfb2F1dGhEYXRhO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBwdWJsaWMgbWV0aG9kcyB3aWxsIGJlIGhlcmUgdGhhdCBhcmUgYWNjZXNzaWJsZSBmcm9tIENvbnRyb2xsZXJcbiAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgbG9naW5SZWRpcmVjdDogZnVuY3Rpb24gKGxvZ2luU2NvcGUgPSBjb25maWcubG9naW5TY29wZSwgZXh0cmFRdWVyeVBhcmFtZXRlcnMgPSBjb25maWcuZXh0cmFRdWVyeVBhcmFtZXRlcnMpIHtcblxuICAgICAgICAgICAgICAgIGlmIChjb25maWcuZW5kcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvckVhY2goY29uZmlnLmVuZHBvaW50cywgZnVuY3Rpb24gKHNjb3BlLCBlbmRwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kSW5Mb2dpblNjb3BlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dpblNjb3BlLmZvckVhY2goZnVuY3Rpb24gKGxvZ2luU2NvcGVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZEluTG9naW5TY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9naW5TY29wZUl0ZW0gPT09IHNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEluTG9naW5TY29wZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm91bmRJbkxvZ2luU2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpblNjb3BlLnB1c2goc2NvcGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX21zYWwubG9naW5SZWRpcmVjdChsb2dpblNjb3BlLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9naW5Qb3B1cDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9tc2FsLmxvZ2luUG9wdXAoY29uZmlnLmxvZ2luU2NvcGUpO1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9naW5JblByb2dyZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9tc2FsLl9sb2dpbkluUHJvZ3Jlc3M7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9nb3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX21zYWwubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgLy9jYWxsIHNpZ25vdXQgcmVsYXRlZCBtZXRob2RcbiAgICAgICAgICAgIH0sIGxvZ091dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9tc2FsLmxvZ291dCgpO1xuICAgICAgICAgICAgICAgIC8vY2FsbCBzaWdub3V0IHJlbGF0ZWQgbWV0aG9kXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0Q2FjaGVkVG9rZW46IGZ1bmN0aW9uIChhdXRoZW50aWNhdGlvblJlcXVlc3QsIHVzZXIgPSBfbXNhbC5nZXRVc2VyKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX21zYWwuZ2V0Q2FjaGVkVG9rZW4oYXV0aGVudGljYXRpb25SZXF1ZXN0LCB1c2VyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VySW5mbzogX29hdXRoRGF0YSxcbiAgICAgICAgICAgIGFjcXVpcmVUb2tlblNpbGVudDogZnVuY3Rpb24gKHNjb3BlcywgYXV0aG9yaXR5ID0gdW5kZWZpbmVkLCB1c2VyID0gdW5kZWZpbmVkLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIGF1dG9tYXRlZCB0b2tlbiByZXF1ZXN0IGNhbGxcbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgIF9tc2FsLl9yZW5ld0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgX21zYWwuYWNxdWlyZVRva2VuU2lsZW50KHNjb3BlcywgYXV0aG9yaXR5LCB1c2VyLCBleHRyYVF1ZXJ5UGFyYW1ldGVycykudGhlbihmdW5jdGlvbiAodG9rZW5PdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgX21zYWwuX3JlbmV3QWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDphY3F1aXJlVG9rZW5TdWNjZXNzJywgdG9rZW5PdXQpO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRva2VuT3V0KTtcblxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yRGVzYyA9IGVyci5zcGxpdCgnOicpWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnIuc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmFjcXVpcmVUb2tlbkZhaWx1cmUnLCBlcnJvckRlc2MsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoJ0Vycm9yJywgJ0Vycm9yIHdoZW4gYWNxdWlyaW5nIHRva2VuIGZvciBzY29wZXM6ICcgKyBzY29wZXMsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yRGVzYyArIFwifFwiICsgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhY3F1aXJlVG9rZW5Qb3B1cDogZnVuY3Rpb24gKHNjb3BlcywgYXV0aG9yaXR5ID0gdW5kZWZpbmVkLCB1c2VyID0gdW5kZWZpbmVkLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgX21zYWwuYWNxdWlyZVRva2VuUG9wdXAoc2NvcGVzLCBhdXRob3JpdHksIHVzZXIsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6YWNxdWlyZVRva2VuU3VjY2VzcycsIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JEZXNjID0gZXJyLnNwbGl0KCc6JylbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IGVyci5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6YWNxdWlyZVRva2VuRmFpbHVyZScsIGVycm9yRGVzYywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcignRXJyb3InLCAnRXJyb3Igd2hlbiBhY3F1aXJpbmcgdG9rZW4gZm9yIHNjb3BlczogJyArIHNjb3BlcywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3JEZXNjICsgXCJ8XCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBhY3F1aXJlVG9rZW5SZWRpcmVjdDogZnVuY3Rpb24gKHNjb3BlcywgYXV0aG9yaXR5ID0gdW5kZWZpbmVkLCB1c2VyID0gdW5kZWZpbmVkLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIF9tc2FsLmFjcXVpcmVUb2tlblJlZGlyZWN0KHNjb3BlcywgYXV0aG9yaXR5LCB1c2VyLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRVc2VyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9tc2FsLmdldFVzZXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRTY29wZUZvckVuZHBvaW50OiBmdW5jdGlvbiAocmVxdWVzdFVybCkge1xuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlZFNjb3BlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGZvckVhY2goY29uZmlnLmVuZHBvaW50cywgZnVuY3Rpb24gKHNjb3BlLCBlbmRwb2ludCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc29sdmVkU2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0VXJsLmluZGV4T2YoZW5kcG9pbnQpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlZFNjb3BlID0gc2NvcGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlZFNjb3BlO1xuXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIF9tc2FsLmdldFJlc291cmNlRm9yRW5kcG9pbnQoZW5kcG9pbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFyQ2FjaGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfbXNhbC5jbGVhckNhY2hlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5mbzogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcihcIkluZm9cIiwgbWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZlcmJvc2U6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJWZXJib3NlXCIsIG1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XTtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvdmlkZXIuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhbmd1bGFyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYW5ndWxhclwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIEludGVyY2VwdG9yIGZvciBodHRwIGlmIG5lZWRlZFxuWydtc2FsQXV0aGVudGljYXRpb25TZXJ2aWNlJywgJyRxJywgJyRyb290U2NvcGUnLCAnJHRlbXBsYXRlQ2FjaGUnLFxuICAgIGZ1bmN0aW9uIHByb3RlY3RlZFJlc291cmNlSW50ZXJjZXB0b3IoYXV0aFNlcnZpY2UsICRxLCAkcm9vdFNjb3BlLCAkdGVtcGxhdGVDYWNoZSkge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVsYXllZFJlcXVlc3QgPSAkcS5kZWZlcigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByZXF1ZXN0IGNhbiBiZSBzZXJ2ZWQgdmlhIHRlbXBsYXRlQ2FjaGUsIG5vIG5lZWQgdG8gdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZUNhY2hlLmdldChjb25maWcudXJsKSkgcmV0dXJuIGNvbmZpZztcblxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBhdXRoU2VydmljZS5nZXRTY29wZUZvckVuZHBvaW50KGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS52ZXJib3NlKCdVcmw6ICcgKyBjb25maWcudXJsICsgJyBtYXBzIHRvIHJlc291cmNlOiAnICsgcmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuU3RvcmVkID0gYXV0aFNlcnZpY2UuYWNxdWlyZVRva2VuU2lsZW50KFtyZXNvdXJjZV0pLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodG9rZW5TdG9yZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5pbmZvKCdUb2tlbiBpcyBhdmFpbGFibGUgZm9yIHRoaXMgdXJsICcgKyBjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBlbmRwb2ludCBtYXBwaW5nIGlmIHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRva2VuU3RvcmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ZWRSZXF1ZXN0LnJlc29sdmUoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5sb2dpbkluUHJvZ3Jlc3MoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYW5jZWwgcmVxdWVzdCBpZiBsb2dpbiBpcyBzdGFydGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXV0aFNlcnZpY2UuY29uZmlnLnBvcFVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5pbmZvKCdVcmw6ICcgKyBjb25maWcudXJsICsgJyB3aWxsIGJlIGxvYWRlZCBhZnRlciBsb2dpbiBpcyBzdWNjZXNzZnVsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsYXllZFJlcXVlc3QgPSAkcS5kZWZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJ21zYWw6bG9naW5TdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCB0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5pbmZvKCdMb2dpbiBjb21wbGV0ZWQsIHNlbmRpbmcgcmVxdWVzdCBmb3IgJyArIGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW5TdG9yZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ZWRSZXF1ZXN0LnJlc29sdmUoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWxheWVkUmVxdWVzdC5wcm9taXNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UuaW5mbygnbG9naW4gaXMgaW4gcHJvZ3Jlc3MuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuZGF0YSA9ICdsb2dpbiBpbiBwcm9ncmVzcywgY2FuY2VsbGluZyB0aGUgcmVxdWVzdCBmb3IgJyArIGNvbmZpZy51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWxheWVkIHJlcXVlc3QgdG8gcmV0dXJuIGFmdGVyIGlmcmFtZSBjb21wbGV0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UuYWNxdWlyZVRva2VuKHJlc291cmNlKS50aGVuKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UudmVyYm9zZSgnVG9rZW4gaXMgYXZhaWxhYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheWVkUmVxdWVzdC5yZXNvbHZlKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLmRhdGEgPSBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ZWRSZXF1ZXN0LnJlamVjdChjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGF5ZWRSZXF1ZXN0LnByb21pc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmluZm8oJ0dldHRpbmcgZXJyb3IgaW4gdGhlIHJlc3BvbnNlOiAnICsgSlNPTi5zdHJpbmdpZnkocmVqZWN0aW9uKSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVqZWN0aW9uLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSBhdXRoU2VydmljZS5nZXRTY29wZUZvckVuZHBvaW50KHJlamVjdGlvbi5jb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vVE9ETzogY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF1dGhTZXJ2aWNlLmNsZWFyQ2FjaGUocmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOm5vdEF1dGhvcml6ZWQnLCByZWplY3Rpb24sIHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDplcnJvclJlc3BvbnNlJywgcmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2ludGVyY2VwdG9yLmpzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibXNhbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcIm1zYWxcIlxuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9