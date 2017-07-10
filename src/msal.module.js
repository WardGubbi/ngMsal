//----------------------------------------------------------------------
// ngMsal v0.1.1
// @preserve Copyright (c) Ward Gubbi & Microsoft Open Technologies, Inc.
// All Rights Reserved
//----------------------------------------------------------------------

'format amd';
/* global define */

(function () {
    // ============= Angular modules- Start =============
    'use strict';

    function ngMsal(angular, msal) {

        var library = {
            angular, msal
        }

        if (!window.Msal) {
            throw new Error('Msal cannot be found by ngMsal. Msal not available globally.'); // Add wiki/troubleshooting section?
            //Issue with msal, cannot import
        }
        else if (msal !== window.Msal) {
            msal = window.Msal;
        }

        if (angular) {
            var ngMsal = angular.module('ngMsal', [])
                .provider('msalAuthenticationService', require("./provider").default)
                .factory('ProtectedResourceInterceptor', require("./interceptor").default);
            return ngMsal.name;
        }
        else {
            window.console.error('Angular.JS is not included');
        }

        return 'ngMsal';
    }

    var isElectron = window && window.process && window.process.type;
    if (typeof define === 'function' && define.amd) {
        define(['angular', 'msal'], ngMsal);
    } else if (typeof module !== 'undefined' && module && module.exports && (typeof require === 'function') && !isElectron) {
        module.exports = ngMsal(require('angular'), require('msal'));
    } else {
        ngMsal(angular, (typeof global !== 'undefined' ? global : window).Msal);
    }


}());

export default 'ngMsal';