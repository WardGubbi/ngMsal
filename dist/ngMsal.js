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
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = msalAuthenticationService;
	
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
	
	module.exports = exports["default"];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("angular");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// Interceptor for http if needed
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = ['msalAuthenticationService', '$q', '$rootScope', '$templateCache', function protectedResourceInterceptor(authService, $q, $rootScope, $templateCache) {
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
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("msal");

/***/ })
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhM2FiYzQzYWVkNDE2YmVhODFiYiIsIndlYnBhY2s6Ly8vLi9zcmMvbXNhbC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3ZpZGVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFuZ3VsYXJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvaW50ZXJjZXB0b3IuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXNhbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDaENBLGFBQVksQ0FBQzs7Ozs7O0FBR1osY0FBWTs7QUFFVCxpQkFBWSxDQUFDOztBQUViLGNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7O0FBRTNCLGFBQUksT0FBTyxHQUFHO0FBQ1Ysb0JBQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUk7VUFDaEI7O0FBRUQsYUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDZCxtQkFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDOztVQUVuRixNQUNJLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDM0IscUJBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2NBQ3RCOztBQUVELGFBQUksT0FBTyxFQUFFO0FBQ1QsaUJB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SjtNQUNKLENBQUM7RUFDTCxDQUFDOzs7Ozs7O0FDOUVOLGtDIiwiZmlsZSI6ImRpc3QvbmdNc2FsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhclwiKSwgcmVxdWlyZShcIm1zYWxcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYW5ndWxhclwiLCBcIm1zYWxcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wibmdNc2FsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhclwiKSwgcmVxdWlyZShcIm1zYWxcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm5nTXNhbFwiXSA9IGZhY3Rvcnkocm9vdFtcImFuZ3VsYXJcIl0sIHJvb3RbXCJtc2FsXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzRfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhM2FiYzQzYWVkNDE2YmVhODFiYiIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gbmdNc2FsIHYwLjEuMVxuLy8gQHByZXNlcnZlIENvcHlyaWdodCAoYykgV2FyZCBHdWJiaSAmIE1pY3Jvc29mdCBPcGVuIFRlY2hub2xvZ2llcywgSW5jLlxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbidmb3JtYXQgYW1kJztcbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgICAvLyA9PT09PT09PT09PT09IEFuZ3VsYXIgbW9kdWxlcy0gU3RhcnQgPT09PT09PT09PT09PVxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGZ1bmN0aW9uIG5nTXNhbChhbmd1bGFyLCBtc2FsKSB7XG5cbiAgICAgICAgdmFyIGxpYnJhcnkgPSB7XG4gICAgICAgICAgICBhbmd1bGFyLCBtc2FsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXdpbmRvdy5Nc2FsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01zYWwgY2Fubm90IGJlIGZvdW5kIGJ5IG5nTXNhbC4gTXNhbCBub3QgYXZhaWxhYmxlIGdsb2JhbGx5LicpOyAvLyBBZGQgd2lraS90cm91Ymxlc2hvb3Rpbmcgc2VjdGlvbj9cbiAgICAgICAgICAgIC8vSXNzdWUgd2l0aCBtc2FsLCBjYW5ub3QgaW1wb3J0XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobXNhbCAhPT0gd2luZG93Lk1zYWwpIHtcbiAgICAgICAgICAgIG1zYWwgPSB3aW5kb3cuTXNhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhbmd1bGFyKSB7XG4gICAgICAgICAgICB2YXIgbmdNc2FsID0gYW5ndWxhci5tb2R1bGUoJ25nTXNhbCcsIFtdKVxuICAgICAgICAgICAgICAgIC5wcm92aWRlcignbXNhbEF1dGhlbnRpY2F0aW9uU2VydmljZScsIHJlcXVpcmUoXCIuL3Byb3ZpZGVyXCIpLmRlZmF1bHQpXG4gICAgICAgICAgICAgICAgLmZhY3RvcnkoJ1Byb3RlY3RlZFJlc291cmNlSW50ZXJjZXB0b3InLCByZXF1aXJlKFwiLi9pbnRlcmNlcHRvclwiKS5kZWZhdWx0KTtcbiAgICAgICAgICAgIHJldHVybiBuZ01zYWwubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5jb25zb2xlLmVycm9yKCdBbmd1bGFyLkpTIGlzIG5vdCBpbmNsdWRlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICduZ01zYWwnO1xuICAgIH1cblxuICAgIHZhciBpc0VsZWN0cm9uID0gd2luZG93ICYmIHdpbmRvdy5wcm9jZXNzICYmIHdpbmRvdy5wcm9jZXNzLnR5cGU7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoWydhbmd1bGFyJywgJ21zYWwnXSwgbmdNc2FsKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyAmJiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpICYmICFpc0VsZWN0cm9uKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gbmdNc2FsKHJlcXVpcmUoJ2FuZ3VsYXInKSwgcmVxdWlyZSgnbXNhbCcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBuZ01zYWwoYW5ndWxhciwgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93KS5Nc2FsKTtcbiAgICB9XG5cblxufSgpKTtcblxuZXhwb3J0IGRlZmF1bHQgJ25nTXNhbCc7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21zYWwubW9kdWxlLmpzIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbXNhbEF1dGhlbnRpY2F0aW9uU2VydmljZSgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBtc2FsID0gd2luZG93Lk1zYWw7XG4gICAgdmFyIGZvckVhY2ggPSByZXF1aXJlKFwiYW5ndWxhclwiKS5mb3JFYWNoO1xuICAgIHZhciBfbXNhbCA9IG51bGw7XG4gICAgdmFyIGNvbnN0YW50cyA9IG1zYWwuQ29uc3RhbnRzO1xuICAgIHZhciBfb2F1dGhEYXRhID0ge1xuICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgICAgICBkaXNwbGF5YWJsZUlkOiAnJyxcbiAgICAgICAgaWRlbnRpdHlQcm92aWRlcjogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB1c2VySWRlbnRpZmllcjogJycsXG4gICAgICAgIGxvZ2luRXJyb3I6ICcnLFxuICAgICAgICBwcm9maWxlOiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHZhciBjb25maWcgPSB7fTtcblxuICAgIHZhciB1cGRhdGVEYXRhRnJvbUNhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdGVtcFVzZXIgPSBfbXNhbC5nZXRVc2VyKCk7XG4gICAgICAgIC8vIG9ubHkgY2FjaGUgbG9va3VwIGhlcmUgdG8gbm90IGludGVycnVwdCB3aXRoIGV2ZW50c1xuICAgICAgICB2YXIgdG9rZW4gPSBfbXNhbC5hY3F1aXJlVG9rZW5TaWxlbnQoW2NvbmZpZy5jbGllbnRJZF0sIGNvbmZpZy5hdXRob3JpdHksIHRlbXBVc2VyKS50aGVuKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgX29hdXRoRGF0YS5pc0F1dGhlbnRpY2F0ZWQgPSB0b2tlbiAhPT0gbnVsbCAmJiB0b2tlbi5sZW5ndGggPiAwO1xuICAgICAgICAgICAgdmFyIHVzZXIgPSBfbXNhbC5nZXRVc2VyKCkgfHwge25hbWU6ICcnfTtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuZGlzcGxheWFibGVJZCA9IHVzZXIuZGlzcGxheWFibGVJZDtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuaWRlbnRpdHlQcm92aWRlciA9IHVzZXIuaWRlbnRpdHlQcm92aWRlcjtcbiAgICAgICAgICAgIF9vYXV0aERhdGEubmFtZSA9IHVzZXIubmFtZTtcbiAgICAgICAgICAgIF9vYXV0aERhdGEudXNlcklkZW50aWZpZXIgPSB1c2VyLnVzZXJJZGVudGlmaWVyO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5wcm9maWxlID0gd2luZG93Lk1zYWwuVXRpbHMuZXh0cmFjdElkVG9rZW4odG9rZW4pO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5sb2dpbkVycm9yID0gJyc7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIF9vYXV0aERhdGEuaXNBdXRoZW50aWNhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgdXNlciA9IF9tc2FsLmdldFVzZXIoKSB8fCB7bmFtZTogJyd9O1xuICAgICAgICAgICAgX29hdXRoRGF0YS5kaXNwbGF5YWJsZUlkID0gdXNlci5kaXNwbGF5YWJsZUlkO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5pZGVudGl0eVByb3ZpZGVyID0gdXNlci5pZGVudGl0eVByb3ZpZGVyO1xuICAgICAgICAgICAgX29hdXRoRGF0YS5uYW1lID0gdXNlci5uYW1lO1xuICAgICAgICAgICAgX29hdXRoRGF0YS51c2VySWRlbnRpZmllciA9IHVzZXIudXNlcklkZW50aWZpZXI7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLnByb2ZpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBfb2F1dGhEYXRhLmxvZ2luRXJyb3IgPSBlcnI7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChfY29uZmlnLCBodHRwUHJvdmlkZXIgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGh0dHBQcm92aWRlciAmJiBodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzKSB7XG4gICAgICAgICAgICBodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ1Byb3RlY3RlZFJlc291cmNlSW50ZXJjZXB0b3InKTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWcgPSBfY29uZmlnO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBpbnN0YW5jZSB3aXRoIGdpdmVuIGNvbmZpZ1xuICAgICAgICBfbXNhbCA9IG5ldyBtc2FsLlVzZXJBZ2VudEFwcGxpY2F0aW9uKGNvbmZpZy5jbGllbnRJZCwgY29uZmlnLmF1dGhvcml0eSwgY29uZmlnLmNhbGxiYWNrLCBjb25maWcudmFsaWRhdGVBdXRob3JpdHkpO1xuICAgICAgICBpZiAoY29uZmlnLnJlZGlyZWN0VXJpKSB7XG4gICAgICAgICAgICBfbXNhbC5yZWRpcmVjdFVyaSA9IGNvbmZpZy5yZWRpcmVjdFVyaTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnLnBvc3RMb2dvdXRyZWRpcmVjdFVyaSkge1xuICAgICAgICAgICAgX21zYWwucG9zdExvZ291dHJlZGlyZWN0VXJpID0gY29uZmlnLnBvc3RMb2dvdXRyZWRpcmVjdFVyaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxvZ2luUmVzb3VyY2UgaXMgdXNlZCB0byBzZXQgYXV0aGVudGljYXRlZCBzdGF0dXNcbiAgICAgICAgdXBkYXRlRGF0YUZyb21DYWNoZSgpO1xuICAgIH07XG5cbiAgICAvLyBzcGVjaWFsIGZ1bmN0aW9uIHRoYXQgZXhwb3NlcyBtZXRob2RzIGluIEFuZ3VsYXIgY29udHJvbGxlclxuICAgIC8vICRyb290U2NvcGUsICR3aW5kb3csICRxLCAkbG9jYXRpb24sICR0aW1lb3V0IGFyZSBpbmplY3RlZCBieSBBbmd1bGFyXG4gICAgdGhpc1snJGdldCddID0gWyckcm9vdFNjb3BlJywgJyR3aW5kb3cnLCAnJHEnLCAnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgJyRpbmplY3RvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkd2luZG93LCAkcSwgJGxvY2F0aW9uLCAkdGltZW91dCwgJGluamVjdG9yKSB7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uQ2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCwgbmV3VXJsLCBvbGRVcmwpIHtcbiAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiVmVyYm9zZVwiLCAnTG9jYXRpb24gY2hhbmdlIGV2ZW50IGZyb20gJyArIG9sZFVybCArICcgdG8gJyArIG5ld1VybCk7XG4gICAgICAgICAgICB2YXIgaGFzaDtcbiAgICAgICAgICAgIGlmICgkbG9jYXRpb24uJCRodG1sNSkge1xuICAgICAgICAgICAgICAgIGhhc2ggPSAkbG9jYXRpb24uaGFzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFzaCA9ICcjJyArICRsb2NhdGlvbi5wYXRoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9jZXNzSGFzaChoYXNoLCBldmVudCk7XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVEYXRhRnJvbUNhY2hlKCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS51c2VySW5mbyA9IF9vYXV0aERhdGE7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgcHJvY2Vzc0hhc2ggPSBmdW5jdGlvbiAoaGFzaCwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChfbXNhbC5pc0NhbGxiYWNrKGhhc2gpKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2sgY2FuIGNvbWUgZnJvbSBsb2dpbiBvciBpZnJhbWUgcmVxdWVzdFxuICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiVmVyYm9zZVwiLCAnUHJvY2Vzc2luZyB0aGUgaGFzaDogJyArIGhhc2gpO1xuICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0SW5mbyA9IF9tc2FsLmdldFJlcXVlc3RJbmZvKGhhc2gpO1xuICAgICAgICAgICAgICAgIF9tc2FsLnNhdmVUb2tlbkZyb21IYXNoKHJlcXVlc3RJbmZvKTtcbiAgICAgICAgICAgICAgICAvLyBSZXR1cm4gdG8gY2FsbGJhY2sgaWYgaXQgaXMgc2VudCBmcm9tIGlmcmFtZVxuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0SW5mby5zdGF0ZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0SW5mby5yZXF1ZXN0VHlwZSA9PT0gX21zYWwuUkVRVUVTVF9UWVBFLlJFTkVXX1RPS0VOKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbXNhbC5fcmVuZXdBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9ICR3aW5kb3cucGFyZW50LmNhbGxCYWNrTWFwcGVkVG9SZW5ld1N0YXRlc1tyZXF1ZXN0SW5mby5zdGF0ZVJlc3BvbnNlXSB8fCBfbXNhbC5jYWxsYmFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIHRoaXMgaXMgYSB0b2tlbiByZW5ld2FsIHJlcXVlc3QgaW4gaUZyYW1lLCB3ZSBkb24ndCBuZWVkIHRvIHByb2NlZWQgd2l0aCB0aGUgbG9jYXRpb24gY2hhbmdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdykgey8vaWYgdG9rZW4gcmVuZXdhbCByZXF1ZXN0IGlzIG1hZGUgaW4gYW4gaWZyYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxsIHdpdGhpbiB0aGUgc2FtZSBjb250ZXh0IHdpdGhvdXQgZnVsbCBwYWdlIHJlZGlyZWN0IGtlZXBzIHRoZSBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrICYmIHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlkX3Rva2VuIG9yIGFjY2Vzc190b2tlbiBjYW4gYmUgcmVuZXdlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHJlcXVlc3RJbmZvLnBhcmFtZXRlcnNbJ2FjY2Vzc190b2tlbiddIHx8IHJlcXVlc3RJbmZvLnBhcmFtZXRlcnNbJ2lkX3Rva2VuJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gcmVxdWVzdEluZm8ucGFyYW1ldGVyc1snZXJyb3InXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JEZXNjcmlwdGlvbiA9IHJlcXVlc3RJbmZvLnBhcmFtZXRlcnNbJ2Vycm9yX2Rlc2NyaXB0aW9uJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCR3aW5kb3cucGFyZW50ID09PSAkd2luZG93ICYmICEkd2luZG93LnBhcmVudC5jYWxsQmFja01hcHBlZFRvUmVuZXdTdGF0ZXNbcmVxdWVzdEluZm8uc3RhdGVSZXNwb25zZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6YWNxdWlyZVRva2VuU3VjY2VzcycsIHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlcnJvciAmJiBlcnJvckRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6YWNxdWlyZVRva2VuRmFpbHVyZScsIGVycm9yLCBlcnJvckRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvckRlc2NyaXB0aW9uLCB0b2tlbiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cpIHsvL2luIGlmcmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3RJbmZvLnJlcXVlc3RUeXBlID09PSBfbXNhbC5SRVFVRVNUX1RZUEUuTE9HSU4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vcm1hbCBmdWxsIGxvZ2luIHJlZGlyZWN0IGhhcHBlbmVkIG9uIHRoZSBwYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVEYXRhRnJvbUNhY2hlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX29hdXRoRGF0YS51c2VySWRlbnRpZmllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWRfdG9rZW4gaXMgYWRkZWQgYXMgdG9rZW4gZm9yIHRoZSBhcHBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlRGF0YUZyb21DYWNoZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnVzZXJJbmZvID0gX29hdXRoRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDpsb2dpblN1Y2Nlc3MnLCBfbXNhbC5fZ2V0SXRlbShjb25zdGFudHMuU3RvcmFnZS5pZFRva2VuKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDpsb2dpbkZhaWx1cmUnLCBfbXNhbC5fZ2V0SXRlbShjb25zdGFudHMuRXJyb3JEZXNjcmlwdGlvbiksIF9tc2FsLl9nZXRJdGVtKGNvbnN0YW50cy5FcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX21zYWwuY2FsbGJhY2sgJiYgdHlwZW9mIF9tc2FsLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9tc2FsLmNhbGxiYWNrKF9tc2FsLl9nZXRJdGVtKGNvbnN0YW50cy5FcnJvckRlc2NyaXB0aW9uKSwgX21zYWwuX2dldEl0ZW0oY29uc3RhbnRzLmlkVG9rZW4pLCBfbXNhbC5fZ2V0SXRlbShjb25zdGFudHMuRXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyByZWRpcmVjdCB0byBsb2dpbiBzdGFydCBwYWdlXG4gICAgICAgICAgICAgICAgICAgIGlmICghX21zYWwucG9wVXAgJiYgd2luZG93LnBhcmVudCA9PT0gd2luZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX21zYWwuY29uZmlnLm5hdmlnYXRlVG9Mb2dpblJlcXVlc3RVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9naW5TdGFydFBhZ2UgPSBfbXNhbC5fZ2V0SXRlbShfbXNhbC5DT05TVEFOVFMuU1RPUkFHRS5MT0dJTl9SRVFVRVNUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxvZ2luU3RhcnRQYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2dpblN0YXJ0UGFnZSAmJiBsb2dpblN0YXJ0UGFnZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJldmVudCB0aGUgY3VycmVudCBsb2NhdGlvbiBjaGFuZ2UgYW5kIHJlZGlyZWN0IHRoZSB1c2VyIGJhY2sgdG8gdGhlIGxvZ2luIHN0YXJ0IHBhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJWZXJib3NlXCIsICdSZWRpcmVjdGluZyB0byBzdGFydCBwYWdlOiAnICsgbG9naW5TdGFydFBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRsb2NhdGlvbi4kJGh0bWw1ICYmIGxvZ2luU3RhcnRQYWdlLmluZGV4T2YoJyMnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKGxvZ2luU3RhcnRQYWdlLnN1YnN0cmluZyhsb2dpblN0YXJ0UGFnZS5pbmRleE9mKCcjJykgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbG9naW5TdGFydFBhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXR0aW5nIHRoZSBoYXNoIHRvIG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGxvY2F0aW9uLiQkaHRtbDUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLmhhc2goJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RhdGUgZGlkIG5vdCBtYXRjaCwgYnJvYWRjYXN0IGFuIGVycm9yXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDpzdGF0ZU1pc21hdGNoJywgX21zYWwuX2dldEl0ZW0oX21zYWwuQ09OU1RBTlRTLlNUT1JBR0UuRVJST1JfREVTQ1JJUFRJT04pLCBfbXNhbC5fZ2V0SXRlbShfbXNhbC5DT05TVEFOVFMuU1RPUkFHRS5FUlJPUikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTm8gY2FsbGJhY2suIEFwcCByZXN1bWVzIGFmdGVyIGNsb3Npbmcgb3IgbW92aW5nIHRvIG5ldyBwYWdlLlxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRva2VuIGFuZCB1c2VybmFtZVxuICAgICAgICAgICAgICAgIHVwZGF0ZURhdGFGcm9tQ2FjaGUoKTtcbiAgICAgICAgICAgICAgICBpZiAoIV9vYXV0aERhdGEuaXNBdXRoZW50aWNhdGVkICYmIF9vYXV0aERhdGEudXNlck5hbWUgJiYgIV9tc2FsLl9yZW5ld0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZF90b2tlbiBpcyBleHBpcmVkIG9yIG5vdCBwcmVzZW50XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gJGluamVjdG9yLmdldCgnbXNhbEF1dGhlbnRpY2F0aW9uU2VydmljZScpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmFjcXVpcmVUb2tlbihfbXNhbC5jb25maWcubG9naW5SZXNvdXJjZSkudGhlbihmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9vYXV0aERhdGEuaXNBdXRoZW50aWNhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JQYXJ0cyA9IGVycm9yLnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6bG9naW5GYWlsdXJlJywgZXJyb3JQYXJ0c1swXSwgZXJyb3JQYXJ0c1sxXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBsb2dpbkhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtc2FsLkxvZ2dlcihcIkluZm9cIiwgJ0xvZ2luIGV2ZW50IGZvcjonICsgJGxvY2F0aW9uLiQkdXJsKTtcbiAgICAgICAgICAgIGlmIChfbXNhbC5jb25maWcgJiYgX21zYWwuY29uZmlnLmxvY2FsTG9naW5VcmwpIHtcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aChfbXNhbC5jb25maWcubG9jYWxMb2dpblVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3RseSBzdGFydCBsb2dpbiBmbG93XG4gICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJJbmZvXCIsICdTdGFydCBsb2dpbiBhdDonICsgJGxvY2F0aW9uLiQkYWJzVXJsKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6bG9naW5SZWRpcmVjdCcpO1xuICAgICAgICAgICAgICAgIF9tc2FsLmxvZ2luKCRsb2NhdGlvbi4kJGFic1VybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBRExvZ2luUmVxdWlyZWQocm91dGUsIGdsb2JhbCkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5yZXF1aXJlQURMb2dpbiA/IHJvdXRlLnJlcXVpcmVBRExvZ2luICE9PSBmYWxzZSA6ICEhcm91dGUucmVxdWlyZUFETG9naW47XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0Fub255bW91c0VuZHBvaW50KHVybCkge1xuICAgICAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcuYW5vbnltb3VzRW5kcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfbXNhbC5jb25maWcuYW5vbnltb3VzRW5kcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmwuaW5kZXhPZihfbXNhbC5jb25maWcuYW5vbnltb3VzRW5kcG9pbnRzW2ldKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFN0YXRlcyh0b1N0YXRlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgdmFyIHN0YXRlcyA9IFtdO1xuICAgICAgICAgICAgaWYgKHRvU3RhdGUuaGFzT3duUHJvcGVydHkoJ3BhcmVudCcpKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0b1N0YXRlO1xuICAgICAgICAgICAgICAgIHdoaWxlIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZXMudW5zaGlmdChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlID0gJGluamVjdG9yLmdldCgnJHN0YXRlJykuZ2V0KHN0YXRlLnBhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlTmFtZXMgPSB0b1N0YXRlLm5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgc3RhdGVOYW1lID0gc3RhdGVOYW1lc1swXTsgaSA8IHN0YXRlTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSAkaW5qZWN0b3IuZ2V0KCckc3RhdGUnKS5nZXQoc3RhdGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RhdGVOYW1lICs9ICcuJyArIHN0YXRlTmFtZXNbaSArIDFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcm91dGVDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gKGUsIG5leHRSb3V0ZSkge1xuICAgICAgICAgICAgaWYgKG5leHRSb3V0ZSAmJiBuZXh0Um91dGUuJCRyb3V0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0FETG9naW5SZXF1aXJlZChuZXh0Um91dGUuJCRyb3V0ZSwgX21zYWwuY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9vYXV0aERhdGEuaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIV9tc2FsLl9yZW5ld0FjdGl2ZSAmJiAhX21zYWwubG9naW5JblByb2dyZXNzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcihcIkluZm9cIiwgJ1JvdXRlIGNoYW5nZSBldmVudCBmb3I6JyArICRsb2NhdGlvbi4kJHVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9naW5IYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0Um91dGVVcmw7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbmV4dFJvdXRlLiQkcm91dGUudGVtcGxhdGVVcmwgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFJvdXRlVXJsID0gbmV4dFJvdXRlLiQkcm91dGUudGVtcGxhdGVVcmwobmV4dFJvdXRlLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Um91dGVVcmwgPSBuZXh0Um91dGUuJCRyb3V0ZS50ZW1wbGF0ZVVybDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFJvdXRlVXJsICYmICFpc0Fub255bW91c0VuZHBvaW50KG5leHRSb3V0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tc2FsLmNvbmZpZy5hbm9ueW1vdXNFbmRwb2ludHMucHVzaChuZXh0Um91dGVVcmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBzdGF0ZUNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoZSwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAgICAgaWYgKHRvU3RhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGVzID0gZ2V0U3RhdGVzKHRvU3RhdGUpO1xuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUgPSBzdGF0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FETG9naW5SZXF1aXJlZChzdGF0ZSwgX21zYWwuY29uZmlnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfb2F1dGhEYXRhLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX21zYWwuX3JlbmV3QWN0aXZlICYmICFfbXNhbC5sb2dpbkluUHJvZ3Jlc3MoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcignSW5mbycsICdTdGF0ZSBjaGFuZ2UgZXZlbnQgZm9yOicgKyAkbG9jYXRpb24uJCR1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dpbkhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RhdGUudGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0U3RhdGVVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN0YXRlLnRlbXBsYXRlVXJsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlVXJsID0gc3RhdGUudGVtcGxhdGVVcmwodG9QYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlVXJsID0gc3RhdGUudGVtcGxhdGVVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dFN0YXRlVXJsICYmICFpc0Fub255bW91c0VuZHBvaW50KG5leHRTdGF0ZVVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbXNhbC5jb25maWcuYW5vbnltb3VzRW5kcG9pbnRzLnB1c2gobmV4dFN0YXRlVXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgc3RhdGVDaGFuZ2VFcnJvckhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAgICAgICBtc2FsLkxvZ2dlcihcIlZlcmJvc2VcIiwgXCJTdGF0ZSBjaGFuZ2UgZXJyb3Igb2NjdXJlZC4gRXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcblxuICAgICAgICAgICAgLy8gbXNhbCBpbnRlcmNlcHRvciBzZXRzIHRoZSBlcnJvciBvbiBjb25maWcuZGF0YSBwcm9wZXJ0eS4gSWYgaXQgaXMgc2V0LCBpdCBtZWFucyBzdGF0ZSBjaGFuZ2UgaXMgcmVqZWN0ZWQgYnkgbXNhbCxcbiAgICAgICAgICAgIC8vIGluIHdoaWNoIGNhc2Ugc2V0IHRoZSBkZWZhdWx0UHJldmVudGVkIHRvIHRydWUgdG8gYXZvaWQgdXJsIHVwZGF0ZSBhcyB0aGF0IHNvbWV0aW1lc2xlYWRzIHRvIGluZmludGUgbG9vcC5cbiAgICAgICAgICAgIGlmIChlcnJvciAmJiBlcnJvci5kYXRhKSB7XG4gICAgICAgICAgICAgICAgbXNhbC5Mb2dnZXIoXCJJbmZvXCIsIFwiU2V0dGluZyBkZWZhdWx0UHJldmVudGVkIHRvIHRydWUgaWYgc3RhdGUgY2hhbmdlIGVycm9yIG9jY3VyZWQgYmVjYXVzZSBtc2FsIHJlamVjdGVkIGEgcmVxdWVzdC4gRXJyb3I6IFwiICsgZXJyb3IuZGF0YSk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSb3V0ZSBjaGFuZ2UgZXZlbnQgdHJhY2tpbmcgdG8gcmVjZWl2ZSBmcmFnbWVudCBhbmQgYWxzbyBhdXRvIHJlbmV3IHRva2Vuc1xuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCByb3V0ZUNoYW5nZUhhbmRsZXIpO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIHN0YXRlQ2hhbmdlSGFuZGxlcik7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgbG9jYXRpb25DaGFuZ2VIYW5kbGVyKTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBzdGF0ZUNoYW5nZUVycm9ySGFuZGxlcik7XG5cbiAgICAgICAgLy9FdmVudCB0byB0cmFjayBoYXNoIGNoYW5nZSBvZlxuICAgICAgICAkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21zYWw6cG9wVXBIYXNoQ2hhbmdlZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBwcm9jZXNzSGFzaChlLmRldGFpbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZURhdGFGcm9tQ2FjaGUoKTtcbiAgICAgICAgJHJvb3RTY29wZS51c2VySW5mbyA9IF9vYXV0aERhdGE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIHB1YmxpYyBtZXRob2RzIHdpbGwgYmUgaGVyZSB0aGF0IGFyZSBhY2Nlc3NpYmxlIGZyb20gQ29udHJvbGxlclxuICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICBsb2dpblJlZGlyZWN0OiBmdW5jdGlvbiAobG9naW5TY29wZSA9IGNvbmZpZy5sb2dpblNjb3BlLCBleHRyYVF1ZXJ5UGFyYW1ldGVycyA9IGNvbmZpZy5leHRyYVF1ZXJ5UGFyYW1ldGVycykge1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5lbmRwb2ludHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yRWFjaChjb25maWcuZW5kcG9pbnRzLCBmdW5jdGlvbiAoc2NvcGUsIGVuZHBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmRJbkxvZ2luU2NvcGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luU2NvcGUuZm9yRWFjaChmdW5jdGlvbiAobG9naW5TY29wZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kSW5Mb2dpblNjb3BlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2dpblNjb3BlSXRlbSA9PT0gc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSW5Mb2dpblNjb3BlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZEluTG9naW5TY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2luU2NvcGUucHVzaChzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfbXNhbC5sb2dpblJlZGlyZWN0KGxvZ2luU2NvcGUsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2dpblBvcHVwOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX21zYWwubG9naW5Qb3B1cChjb25maWcubG9naW5TY29wZSk7XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2dpbkluUHJvZ3Jlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX21zYWwuX2xvZ2luSW5Qcm9ncmVzcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2dvdXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfbXNhbC5sb2dvdXQoKTtcbiAgICAgICAgICAgICAgICAvL2NhbGwgc2lnbm91dCByZWxhdGVkIG1ldGhvZFxuICAgICAgICAgICAgfSwgbG9nT3V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX21zYWwubG9nb3V0KCk7XG4gICAgICAgICAgICAgICAgLy9jYWxsIHNpZ25vdXQgcmVsYXRlZCBtZXRob2RcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRDYWNoZWRUb2tlbjogZnVuY3Rpb24gKGF1dGhlbnRpY2F0aW9uUmVxdWVzdCwgdXNlciA9IF9tc2FsLmdldFVzZXIoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfbXNhbC5nZXRDYWNoZWRUb2tlbihhdXRoZW50aWNhdGlvblJlcXVlc3QsIHVzZXIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVzZXJJbmZvOiBfb2F1dGhEYXRhLFxuICAgICAgICAgICAgYWNxdWlyZVRva2VuU2lsZW50OiBmdW5jdGlvbiAoc2NvcGVzLCBhdXRob3JpdHkgPSB1bmRlZmluZWQsIHVzZXIgPSB1bmRlZmluZWQsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgLy8gYXV0b21hdGVkIHRva2VuIHJlcXVlc3QgY2FsbFxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgX21zYWwuX3JlbmV3QWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBfbXNhbC5hY3F1aXJlVG9rZW5TaWxlbnQoc2NvcGVzLCBhdXRob3JpdHksIHVzZXIsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uICh0b2tlbk91dCkge1xuICAgICAgICAgICAgICAgICAgICBfbXNhbC5fcmVuZXdBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmFjcXVpcmVUb2tlblN1Y2Nlc3MnLCB0b2tlbk91dCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUodG9rZW5PdXQpO1xuXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JEZXNjID0gZXJyLnNwbGl0KCc6JylbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IGVyci5zcGxpdCgnOicpWzFdO1xuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6YWNxdWlyZVRva2VuRmFpbHVyZScsIGVycm9yRGVzYywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcignRXJyb3InLCAnRXJyb3Igd2hlbiBhY3F1aXJpbmcgdG9rZW4gZm9yIHNjb3BlczogJyArIHNjb3BlcywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3JEZXNjICsgXCJ8XCIgKyBlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGFjcXVpcmVUb2tlblBvcHVwOiBmdW5jdGlvbiAoc2NvcGVzLCBhdXRob3JpdHkgPSB1bmRlZmluZWQsIHVzZXIgPSB1bmRlZmluZWQsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICBfbXNhbC5hY3F1aXJlVG9rZW5Qb3B1cChzY29wZXMsIGF1dGhvcml0eSwgdXNlciwgZXh0cmFRdWVyeVBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDphY3F1aXJlVG9rZW5TdWNjZXNzJywgdG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvckRlc2MgPSBlcnIuc3BsaXQoJzonKVswXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gZXJyLnNwbGl0KCc6JylbMV07XG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnbXNhbDphY3F1aXJlVG9rZW5GYWlsdXJlJywgZXJyb3JEZXNjLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKCdFcnJvcicsICdFcnJvciB3aGVuIGFjcXVpcmluZyB0b2tlbiBmb3Igc2NvcGVzOiAnICsgc2NvcGVzLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvckRlc2MgKyBcInxcIiArIGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGFjcXVpcmVUb2tlblJlZGlyZWN0OiBmdW5jdGlvbiAoc2NvcGVzLCBhdXRob3JpdHkgPSB1bmRlZmluZWQsIHVzZXIgPSB1bmRlZmluZWQsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzID0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgX21zYWwuYWNxdWlyZVRva2VuUmVkaXJlY3Qoc2NvcGVzLCBhdXRob3JpdHksIHVzZXIsIGV4dHJhUXVlcnlQYXJhbWV0ZXJzKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFVzZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX21zYWwuZ2V0VXNlcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldFNjb3BlRm9yRW5kcG9pbnQ6IGZ1bmN0aW9uIChyZXF1ZXN0VXJsKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc29sdmVkU2NvcGUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgZm9yRWFjaChjb25maWcuZW5kcG9pbnRzLCBmdW5jdGlvbiAoc2NvcGUsIGVuZHBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzb2x2ZWRTY29wZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RVcmwuaW5kZXhPZihlbmRwb2ludCkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmVkU2NvcGUgPSBzY29wZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkU2NvcGU7XG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gX21zYWwuZ2V0UmVzb3VyY2VGb3JFbmRwb2ludChlbmRwb2ludCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJDYWNoZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9tc2FsLmNsZWFyQ2FjaGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbmZvOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIG1zYWwuTG9nZ2VyKFwiSW5mb1wiLCBtZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmVyYm9zZTogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBtc2FsLkxvZ2dlcihcIlZlcmJvc2VcIiwgbWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1dO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm92aWRlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFuZ3VsYXJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJhbmd1bGFyXCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gSW50ZXJjZXB0b3IgZm9yIGh0dHAgaWYgbmVlZGVkXG5leHBvcnQgZGVmYXVsdCBbJ21zYWxBdXRoZW50aWNhdGlvblNlcnZpY2UnLCAnJHEnLCAnJHJvb3RTY29wZScsICckdGVtcGxhdGVDYWNoZScsXG4gICAgZnVuY3Rpb24gcHJvdGVjdGVkUmVzb3VyY2VJbnRlcmNlcHRvcihhdXRoU2VydmljZSwgJHEsICRyb290U2NvcGUsICR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHZhciBkZWxheWVkUmVxdWVzdCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzID0gY29uZmlnLmhlYWRlcnMgfHwge307XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJlcXVlc3QgY2FuIGJlIHNlcnZlZCB2aWEgdGVtcGxhdGVDYWNoZSwgbm8gbmVlZCB0byB0b2tlblxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlQ2FjaGUuZ2V0KGNvbmZpZy51cmwpKSByZXR1cm4gY29uZmlnO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZSA9IGF1dGhTZXJ2aWNlLmdldFNjb3BlRm9yRW5kcG9pbnQoY29uZmlnLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnZlcmJvc2UoJ1VybDogJyArIGNvbmZpZy51cmwgKyAnIG1hcHMgdG8gcmVzb3VyY2U6ICcgKyByZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW5TdG9yZWQgPSBhdXRoU2VydmljZS5hY3F1aXJlVG9rZW5TaWxlbnQoW3Jlc291cmNlXSkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh0b2tlblN0b3JlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmluZm8oJ1Rva2VuIGlzIGF2YWlsYWJsZSBmb3IgdGhpcyB1cmwgJyArIGNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGVuZHBvaW50IG1hcHBpbmcgaWYgcHJvdmlkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdG9rZW5TdG9yZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXllZFJlcXVlc3QucmVzb2x2ZShjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF1dGhTZXJ2aWNlLmxvZ2luSW5Qcm9ncmVzcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhbmNlbCByZXF1ZXN0IGlmIGxvZ2luIGlzIHN0YXJ0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdXRoU2VydmljZS5jb25maWcucG9wVXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmluZm8oJ1VybDogJyArIGNvbmZpZy51cmwgKyAnIHdpbGwgYmUgbG9hZGVkIGFmdGVyIGxvZ2luIGlzIHN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWxheWVkUmVxdWVzdCA9ICRxLmRlZmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignbXNhbDpsb2dpblN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXZlbnQsIHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmluZm8oJ0xvZ2luIGNvbXBsZXRlZCwgc2VuZGluZyByZXF1ZXN0IGZvciAnICsgY29uZmlnLnVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlblN0b3JlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXllZFJlcXVlc3QucmVzb2x2ZShjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlbGF5ZWRSZXF1ZXN0LnByb21pc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5pbmZvKCdsb2dpbiBpcyBpbiBwcm9ncmVzcy4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5kYXRhID0gJ2xvZ2luIGluIHByb2dyZXNzLCBjYW5jZWxsaW5nIHRoZSByZXF1ZXN0IGZvciAnICsgY29uZmlnLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlbGF5ZWQgcmVxdWVzdCB0byByZXR1cm4gYWZ0ZXIgaWZyYW1lIGNvbXBsZXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5hY3F1aXJlVG9rZW4ocmVzb3VyY2UpLnRoZW4oZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS52ZXJib3NlKCdUb2tlbiBpcyBhdmFpbGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5ZWRSZXF1ZXN0LnJlc29sdmUoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcuZGF0YSA9IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXllZFJlcXVlc3QucmVqZWN0KGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsYXllZFJlcXVlc3QucHJvbWlzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXNwb25zZUVycm9yOiBmdW5jdGlvbiAocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgYXV0aFNlcnZpY2UuaW5mbygnR2V0dGluZyBlcnJvciBpbiB0aGUgcmVzcG9uc2U6ICcgKyBKU09OLnN0cmluZ2lmeShyZWplY3Rpb24pKTtcbiAgICAgICAgICAgICAgICBpZiAocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWplY3Rpb24uc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvdXJjZSA9IGF1dGhTZXJ2aWNlLmdldFNjb3BlRm9yRW5kcG9pbnQocmVqZWN0aW9uLmNvbmZpZy51cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBjaGVja1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXV0aFNlcnZpY2UuY2xlYXJDYWNoZShyZXNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ21zYWw6bm90QXV0aG9yaXplZCcsIHJlamVjdGlvbiwgcmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdtc2FsOmVycm9yUmVzcG9uc2UnLCByZWplY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW50ZXJjZXB0b3IuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJtc2FsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibXNhbFwiXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=