'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reg) {
    if (Object.prototype.toString.call(rule) === '[object Function]') {
        return (0, _mobxFormValidate2.default)(function (value, source) {
            return test(value, reg(value, source));
        });
    } else if (Object.prototype.toString.call(rule) === '[object Object]') {
        return (0, _mobxFormValidate2.default)(function (value, source) {
            return test(value, [reg]);
        });
    } else {
        return (0, _mobxFormValidate2.default)(function (value, source) {
            return test(value, reg);
        });
    }
};

var _mobxFormValidate = require('mobx-form-validate');

var _mobxFormValidate2 = _interopRequireDefault(_mobxFormValidate);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var isNullOrUndefined = function isNullOrUndefined(v) {
    return v === undefined || v === null;
};

var Types = {
    Ascii: function Ascii(v) {
        return _validator2.default.isAscii(v);
    },
    Base64: function Base64(v) {
        return _validator2.default.isBase64(v);
    },
    Boolean: function Boolean(v) {
        return _validator2.default.isBoolean(v);
    },
    /**
     * 信用卡
     */
    CreditCard: function CreditCard(v) {
        return _validator2.default.isCreditCard(v);
    },
    /**
     * 有效的金额数字
     */
    Currency: function Currency(v) {
        return _validator2.default.isCurrency(v);
    },
    DataURI: function DataURI(v) {
        return _validator2.default.isDataURI(v);
    },
    Decimal: function Decimal(v) {
        return _validator2.default.isDecimal(v);
    },
    Email: function Email(v) {
        return _validator2.default.isEmail(v);
    },
    Float: function Float(v) {
        return _validator2.default.isFloat(v);
    },
    HexColor: function HexColor(v) {
        return _validator2.default.isHexColor(v);
    },
    Hexadecimal: function Hexadecimal(v) {
        return _validator2.default.isHexadecimal(v);
    },
    IP: function IP(v) {
        return _validator2.default.isIP(v);
    },
    Int: function Int(v) {
        return _validator2.default.Int(v);
    },
    JSON: function JSON(v) {
        return _validator2.default.isJSON(v);
    },
    MACAddress: function MACAddress(v) {
        return _validator2.default.isMACAddress(v);
    },
    Numeric: function Numeric(v) {
        return _validator2.default.isNumeric(v);
    },
    URL: function URL(v) {
        return _validator2.default.isURL(v);
    },
    UUID: function UUID(v) {
        return _validator2.default.isUUID(v);
    }
};

var regRules = {
    type: function type(target, value) {
        return !isNullOrUndefined(target) && !Types[value](target);
    },
    /** 必填 */
    required: function required(target, value) {
        return isNullOrUndefined(target) && value;
    },
    /** 最大值 */
    max: function max(target, value) {
        return target > value;
    },
    /** 最小值  */
    min: function min(target, value) {
        return target < value;
    },
    /** 正则 */
    pattern: function pattern(target, value) {
        return !isNullOrUndefined(target) && value && value.test && !value.test(target);
    },
    /**
     * @param {String} target
     * @param {Array} value 长度范围 eg: length:[6,15]
     */
    length: function length(target, value) {
        if (Object.prototype.toString.call(value) === '[object Array]' && value.length === 2) {
            return !isNullOrUndefined(target) && target.length && target.length > value[0] && target.length < value[1];
        }
    }
};

function test(target, rules) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _rule = _step.value;

            var message = _rule.message,
                other = _objectWithoutProperties(_rule, ['message']);

            for (var reg in other) {
                if (regRules[reg](target, _rule[reg])) {
                    return message || 'error';
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

/**
 *
 * @param {Function|Array|Object} reg 校验规则
 */