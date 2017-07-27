"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelCase = require("camelcase");
const mobx = require("mobx");
const validator = require("validator");
const { computed } = mobx;
var Types;
(function (Types) {
    Types["Ascii"] = "isAscii";
    Types["Base64"] = "isBase64";
    Types["Boolean"] = "isBoolean";
    Types["CreditCard"] = "isCreditCard";
    Types["Currency"] = "isCurrency";
    Types["DataURI"] = "isDataURI";
    Types["Decimal"] = "isDecimal";
    Types["Email"] = "isEmail";
    Types["Float"] = "isFloat";
    Types["HexColor"] = "isHexColor";
    Types["Hexadecimal"] = "isHexadecimal";
    Types["IP"] = "isIP";
    Types["Int"] = "isInt";
    Types["JSON"] = "isJSON";
    Types["MACAddress"] = "isMACAddress";
    Types["Numeric"] = "isNumeric";
    Types["URL"] = "isURL";
    Types["UUID"] = "isUUID";
})(Types = exports.Types || (exports.Types = {}));
/**
 * 判断是否为NULL或者underfined
 * 如果v是字符串，则还要判断长度是否为0
 * @param v 要判断的参数
 */
function isEmpty(v) {
    let result = v === undefined || v === null;
    if (result && typeof v === 'string') {
        result = !!result;
    }
    return result;
}
class Method {
    /**
     * 是否必填
     * @param target 要检测的目标属性
     * @param value 标准值
     */
    static required(targetValue, value) {
        return !isEmpty(targetValue) && value;
    }
    /**
     * 最大值
     * @param targetValue 要检测的目标属性
     * @param value 标准值
     */
    static max(targetValue, value) {
        return targetValue > value;
    }
    /**
     * 最小值
     * @param targetValue 要检测的目标属性
     * @param value 标准值
     */
    static min(targetValue, value) {
        return targetValue < value;
    }
    /**
     * 判断类型
     * @param targetValue 要检测的目标属性
     * @param value 类型
     */
    static type(targetValue, value) {
        if (!isEmpty(targetValue) && value && validator[value]) {
            return !validator[value](targetValue);
        }
    }
}
function defineComputedProperty(target, name, descriptor) {
    Object.defineProperty(target, name, descriptor);
    computed(target, name, descriptor);
}
function getValidateError() {
    return this.constructor.__validateFields.find((key) => this[key]);
}
exports.getValidateError = getValidateError;
function getIsValid() {
    return !this.validateError;
}
exports.getIsValid = getIsValid;
/**
 * @param reg 校验规则
 * @param msg 全局提示信息
 */
function valid(rules) {
    return (target, name, args) => {
        const validateName = camelCase('validateError', name);
        const descriptor = {
            configurable: true,
            enumerable: false,
            get: function getter() {
                return test(name, this[name], this, rules);
            },
        };
        defineComputedProperty(target, validateName, descriptor);
        const clazz = target.constructor;
        if (clazz.hasOwnProperty('__validateFields')) {
            clazz.__validateFields.push(validateName);
        }
        else {
            Object.defineProperty(clazz, '__validateFields', {
                configurable: true,
                enumerable: false,
                value: [validateName],
            });
        }
        if (!target.hasOwnProperty('validateError')) {
            defineComputedProperty(target, 'validateError', {
                configurable: true,
                enumerable: false,
                get: getValidateError,
            });
        }
        if (!target.hasOwnProperty('isValid')) {
            defineComputedProperty(target, 'isValid', {
                configurable: true,
                enumerable: false,
                get: getIsValid,
            });
        }
    };
}
function test(target, targetValue, source, rules) {
    for (const rule of rules) {
        const { message, validator: validFunc, transform, ...other } = rule;
        // 如果validator有值，则其他校验属性无效
        if (validFunc) {
            return rule.validator(target, targetValue, source);
        }
        else {
            let value = transform && transform(targetValue);
            value = value || targetValue;
            for (const reg in other) {
                if (Method[reg](targetValue, rule[reg])) {
                    return message || 'error';
                }
            }
        }
    }
}
exports.default = valid;
