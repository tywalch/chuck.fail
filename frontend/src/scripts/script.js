var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomColor(colors) {
    var index = getRandomNumber(0, colors.length - 1);
    return colors[index];
}
var VacationTracker = /** @class */ (function () {
    function VacationTracker() {
        this.HOUR = 1000 * 60 * 60;
        this.lastVacationDate = (this.HOUR * 73);
    }
    VacationTracker.prototype.getHoursSince = function (since) {
        var now = Date.now();
        this.lastVacationDate = Math.ceil(Math.max((now - since) / this.HOUR));
        return this.lastVacationDate;
    };
    VacationTracker.prototype.fetchLastVacationDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Date.now() - this.lastVacationDate];
            });
        });
    };
    VacationTracker.prototype.getDuration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastVacationDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchLastVacationDate()];
                    case 1:
                        lastVacationDate = _a.sent();
                        return [2 /*return*/, this.getHoursSince(lastVacationDate)];
                }
            });
        });
    };
    VacationTracker.prototype.resetDuration = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lastVacationDate = Date.now();
                return [2 /*return*/];
            });
        });
    };
    return VacationTracker;
}());
function createVacationTracker() {
    return new VacationTracker();
}
function createTallyMark() {
    function applyTallyMarkCount(options) {
        var num = options.num, tally = options.tally;
        if (isNaN(num) || num < 1 || num > 5) {
            tally.style.display = 'none';
        }
        else {
            tally.style.display = 'block';
            tally.src = "./img/tallymark".concat(num, ".svg");
        }
        return tally;
    }
    function createTallyGroupElement() {
        var group = document.createElement('div');
        group.className = 'tally-group';
        return group;
    }
    function createTallyMarkElement(options) {
        var num = options.num;
        var tally = document.createElement('img');
        tally.alt = "Tallymark";
        tally.className = 'tally-marks';
        return applyTallyMarkCount({ num: num, tally: tally });
    }
    function prepareTallyGroups(options) {
        var max = options.max, container = options.container;
        var groups = [];
        var appendCurrent = function (group) {
            return currentTallyGroup && container.appendChild(currentTallyGroup);
        };
        var currentTallyGroup = createTallyGroupElement();
        for (var i = 0; i < max + 1; i++) {
            if (i % 5 === 0) {
                currentTallyGroup = createTallyGroupElement();
                appendCurrent(currentTallyGroup);
            }
            groups.push(currentTallyGroup);
        }
        return groups;
    }
    function applyTallyMark(options) {
        var num = options.num, group = options.group;
        var tally = createTallyMarkElement({ num: num });
        group.replaceChildren(tally);
    }
    function incrementTally(options) {
        return __asyncGenerator(this, arguments, function incrementTally_1() {
            var max, interval, count, tally;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        max = options.max, interval = options.interval;
                        count = 0;
                        _a.label = 1;
                    case 1:
                        if (!(count < max)) return [3 /*break*/, 6];
                        tally = (count % 5) + 1;
                        return [4 /*yield*/, __await({ tally: tally, count: count })];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, __await(sleep(interval))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        count++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function decrementTally(options) {
        return __asyncGenerator(this, arguments, function decrementTally_1() {
            var current, interval, count, tally;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        current = options.current, interval = options.interval;
                        count = current - 1;
                        _a.label = 1;
                    case 1:
                        if (!(count >= 0)) return [3 /*break*/, 6];
                        tally = (count % 5) - 1;
                        return [4 /*yield*/, __await({ tally: tally, count: count })];
                    case 2: return [4 /*yield*/, _a.sent()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, __await(sleep(interval))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        count--;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return {
        applyTallyMark: applyTallyMark,
        incrementTally: incrementTally,
        decrementTally: decrementTally,
        prepareTallyGroups: prepareTallyGroups
    };
}
function app(_a) {
    var _b, e_1, _c, _d;
    var _e;
    var elements = _a.elements, animation = _a.animation, tallymark = _a.tallymark, celebration = _a.celebration, tallyCounter = _a.tallyCounter, resetDuration = _a.resetDuration, initialDuration = _a.initialDuration;
    return __awaiter(this, void 0, void 0, function () {
        var incrementOptions, _f, _g, _h, tally, count, e_1_1;
        var _this = this;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    incrementOptions = {
                        max: initialDuration,
                        interval: animation.delay / initialDuration
                    };
                    return [4 /*yield*/, sleep(animation.delay)];
                case 1:
                    _j.sent();
                    _j.label = 2;
                case 2:
                    _j.trys.push([2, 7, 8, 13]);
                    _f = true, _g = __asyncValues(tallymark.incrementTally(incrementOptions));
                    _j.label = 3;
                case 3: return [4 /*yield*/, _g.next()];
                case 4:
                    if (!(_h = _j.sent(), _b = _h.done, !_b)) return [3 /*break*/, 6];
                    _d = _h.value;
                    _f = false;
                    try {
                        tally = _d.tally, count = _d.count;
                        tallyCounter.set({ count: count, tally: tally });
                    }
                    finally {
                        _f = true;
                    }
                    _j.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _j.trys.push([8, , 11, 12]);
                    if (!(!_f && !_b && (_c = _g["return"]))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _c.call(_g)];
                case 9:
                    _j.sent();
                    _j.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    (_e = elements.resetButton) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                        var current, interval, _a, _b, _c, tally, count, e_2_1;
                        var _d, e_2, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    current = tallyCounter.get();
                                    interval = incrementOptions.interval / 2;
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(tallymark.decrementTally({ current: current, interval: interval }));
                                    _g.label = 2;
                                case 2: return [4 /*yield*/, _b.next()];
                                case 3:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                    _f = _c.value;
                                    _a = false;
                                    try {
                                        tally = _f.tally, count = _f.count;
                                        tallyCounter.set({ count: count, tally: tally });
                                    }
                                    finally {
                                        _a = true;
                                    }
                                    _g.label = 4;
                                case 4: return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_2_1 = _g.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _g.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_d && (_e = _b["return"]))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 8:
                                    _g.sent();
                                    _g.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    celebration.start();
                                    return [4 /*yield*/, sleep(9000)];
                                case 13:
                                    _g.sent();
                                    tallyCounter.set({ count: 1, tally: 1 });
                                    celebration.stop();
                                    return [4 /*yield*/, resetDuration()];
                                case 14:
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function isAppElements(elements) {
    return elements.tallyContainer instanceof HTMLElement &&
        elements.totalContainer instanceof HTMLElement &&
        elements.totalDisplay instanceof HTMLElement &&
        elements.resetButton instanceof HTMLButtonElement &&
        elements.confettiContainer instanceof HTMLElement &&
        elements.appContainer instanceof HTMLElement;
}
function getAppElements() {
    var elements = {
        tallyContainer: document.getElementById('root'),
        totalContainer: document.querySelector('.count-body'),
        totalDisplay: document.querySelector('.count-body-hours'),
        resetButton: document.getElementById('btn-reset'),
        confettiContainer: document.getElementsByClassName('confetti-container')[0],
        appContainer: document.getElementsByTagName('body')[0]
    };
    if (isAppElements(elements)) {
        return elements;
    }
    throw new Error('Missing required elements');
}
function createSetDisplayCountFn(options) {
    var totalDisplay = options.totalDisplay, colors = options.colors;
    return function (count) {
        totalDisplay.style.color = count > 0
            ? colors.failure
            : colors.success;
        totalDisplay.textContent = "".concat(count, " hrs");
    };
}
function createTallyTracker(options) {
    var groups = options.groups, applyTallyMarkCount = options.applyTallyMarkCount, setDisplayTextCount = options.setDisplayTextCount;
    var current = 0;
    return {
        set: function (_a) {
            var count = _a.count, tally = _a.tally;
            current = count;
            var group = groups[count];
            setDisplayTextCount(count);
            applyTallyMarkCount({ num: tally, group: group });
        },
        get: function () {
            return current;
        }
    };
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var elements_1, vacationer_1, tallymark, colors_1, celebration, initialDuration, resetDuration, setDisplayCount, groups, tallyCounter, animation, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    elements_1 = getAppElements();
                    vacationer_1 = createVacationTracker();
                    tallymark = createTallyMark();
                    colors_1 = {
                        success: "#4caf50",
                        failure: "#f44336",
                        background: "#111111fa"
                    };
                    celebration = {
                        start: function () {
                            elements_1.confettiContainer.style.zIndex = "1000";
                            elements_1.resetButton.style.display = "none";
                            elements_1.confettiContainer.style.display = "block";
                            elements_1.appContainer.style.backgroundColor = colors_1.success;
                        },
                        stop: function () {
                            elements_1.confettiContainer.style.zIndex = "-1";
                            elements_1.resetButton.style.display = "block";
                            elements_1.confettiContainer.style.display = "none";
                            elements_1.appContainer.style.backgroundColor = colors_1.background;
                        }
                    };
                    return [4 /*yield*/, vacationer_1.getDuration()];
                case 1:
                    initialDuration = _a.sent();
                    resetDuration = function () { return vacationer_1.resetDuration(); };
                    setDisplayCount = createSetDisplayCountFn({
                        totalDisplay: elements_1.totalDisplay,
                        colors: colors_1
                    });
                    groups = tallymark.prepareTallyGroups({
                        container: elements_1.tallyContainer,
                        max: initialDuration
                    });
                    tallyCounter = createTallyTracker({
                        applyTallyMarkCount: tallymark.applyTallyMark,
                        setDisplayTextCount: setDisplayCount,
                        groups: groups
                    });
                    animation = {
                        delay: 1500,
                        duration: 2000
                    };
                    return [4 /*yield*/, app({
                            elements: elements_1,
                            tallymark: tallymark,
                            animation: animation,
                            celebration: celebration,
                            tallyCounter: tallyCounter,
                            resetDuration: resetDuration,
                            initialDuration: initialDuration
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('This app is garbage', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
