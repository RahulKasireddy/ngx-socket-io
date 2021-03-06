(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('socket.io-client')) :
    typeof define === 'function' && define.amd ? define('ngx-socket-io', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', 'socket.io-client'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-socket-io'] = {}, global.ng.core, global.rxjs, global.rxjs.operators, global.io.client));
}(this, (function (exports, core, rxjs, operators, io) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var io__namespace = /*#__PURE__*/_interopNamespace(io);

    var WrappedSocket = /** @class */ (function () {
        function WrappedSocket(config) {
            this.config = config;
            this.subscribersCounter = {};
            this.eventObservables$ = {};
            this.emptyConfig = {
                url: '',
                options: {},
            };
            if (config === undefined) {
                config = this.emptyConfig;
            }
            var url = config.url;
            var options = config.options;
            var ioFunc = io__namespace.default ? io__namespace.default : io__namespace;
            this.ioSocket = ioFunc(url, options);
        }
        WrappedSocket.prototype.of = function (namespace) {
            this.ioSocket.of(namespace);
        };
        WrappedSocket.prototype.on = function (eventName, callback) {
            this.ioSocket.on(eventName, callback);
        };
        WrappedSocket.prototype.once = function (eventName, callback) {
            this.ioSocket.once(eventName, callback);
        };
        WrappedSocket.prototype.connect = function () {
            return this.ioSocket.connect();
        };
        WrappedSocket.prototype.disconnect = function (_close) {
            return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
        };
        WrappedSocket.prototype.emit = function (_eventName) {
            var _args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                _args[_i - 1] = arguments[_i];
            }
            return this.ioSocket.emit.apply(this.ioSocket, arguments);
        };
        WrappedSocket.prototype.removeListener = function (_eventName, _callback) {
            return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
        };
        WrappedSocket.prototype.removeAllListeners = function (_eventName) {
            return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
        };
        WrappedSocket.prototype.fromEvent = function (eventName) {
            var _this = this;
            if (!this.subscribersCounter[eventName]) {
                this.subscribersCounter[eventName] = 0;
            }
            this.subscribersCounter[eventName]++;
            if (!this.eventObservables$[eventName]) {
                this.eventObservables$[eventName] = new rxjs.Observable(function (observer) {
                    var listener = function (data) {
                        observer.next(data);
                    };
                    _this.ioSocket.on(eventName, listener);
                    return function () {
                        _this.subscribersCounter[eventName]--;
                        if (_this.subscribersCounter[eventName] === 0) {
                            _this.ioSocket.removeListener(eventName, listener);
                            delete _this.eventObservables$[eventName];
                        }
                    };
                }).pipe(operators.share());
            }
            return this.eventObservables$[eventName];
        };
        WrappedSocket.prototype.fromOneTimeEvent = function (eventName) {
            var _this = this;
            return new Promise(function (resolve) { return _this.once(eventName, resolve); });
        };
        return WrappedSocket;
    }());

    /** Socket factory */
    function SocketFactory(config) {
        return new WrappedSocket(config);
    }
    var SOCKET_CONFIG_TOKEN = new core.InjectionToken('__SOCKET_IO_CONFIG__');
    var SocketIoModule = /** @class */ (function () {
        function SocketIoModule() {
        }
        SocketIoModule.forRoot = function (config) {
            return {
                ngModule: SocketIoModule,
                providers: [
                    { provide: SOCKET_CONFIG_TOKEN, useValue: config },
                    {
                        provide: WrappedSocket,
                        useFactory: SocketFactory,
                        deps: [SOCKET_CONFIG_TOKEN],
                    },
                ],
            };
        };
        return SocketIoModule;
    }());
    SocketIoModule.decorators = [
        { type: core.NgModule, args: [{},] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Socket = WrappedSocket;
    exports.SocketIoModule = SocketIoModule;
    exports.??a = SocketFactory;
    exports.??b = SOCKET_CONFIG_TOKEN;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-socket-io.umd.js.map
