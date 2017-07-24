import validate from 'mobx-form-validate';
import validator from 'validator';

const isNullOrUndefined = v => v === undefined || v === null

const Types = {
    Ascii: (v) => validator.isAscii(v),
    Base64: (v) => validator.isBase64(v),
    Boolean: (v) => validator.isBoolean(v),
    /**
     * 信用卡
     */
    CreditCard: (v) => validator.isCreditCard(v),
    /**
     * 有效的金额数字
     */
    Currency: (v) => validator.isCurrency(v),
    DataURI: (v) => validator.isDataURI(v),
    Decimal: (v) => validator.isDecimal(v),
    Email: (v) => validator.isEmail(v),
    Float: (v) => validator.isFloat(v),
    HexColor: (v) => validator.isHexColor(v),
    Hexadecimal: (v) => validator.isHexadecimal(v),
    IP: (v) => validator.isIP(v),
    Int: (v) => validator.Int(v),
    JSON: (v) => validator.isJSON(v),
    MACAddress: (v) => validator.isMACAddress(v),
    Numeric: (v) => validator.isNumeric(v),
    URL: (v) => validator.isURL(v),
    UUID: (v) => validator.isUUID(v),
}

const regRules = {
    type: (target, value) => !isNullOrUndefined(target) && !Types[value](target),
    /** 必填 */
    required: (target, value) => (isNullOrUndefined(target) || target === '') && value,
    /** 最大值 */
    max: (target, value) => target > value,
    /** 最小值  */
    min: (target, value) => target < value,
    /** 正则 */
    pattern: (target, value) => !isNullOrUndefined(target) && value && value.test && !value.test(target),
    /**
     * @param {String} target
     * @param {Array} value 长度范围 eg: length:[6,15]
     */
    length: (target, value) => {
        if (Object.prototype.toString.call(value) === '[object Array]' && value.length === 2) {
            return !isNullOrUndefined(target) && target.length && !(target.length > value[0] && target.length < value[1])
        }
    }
}

function test(target, rules) {
    for (let rule of rules) {
        const { message, ...other } = rule
        const funcs = Object.keys(other)
        if (funcs.length <= 0 && message) return message || 'error'
        for (let reg of funcs) {
            if (regRules[reg](target, rule[reg])) {
                return message || 'error'
            }
        }
    }
}

/**
 *
 * @param {Function|Array|Object} reg 校验规则
 */
export default function (reg) {
    if (Object.prototype.toString.call(reg) === '[object Function]') {
        return validate((value, source) => test(value, reg(value, source)))
    } else if (Object.prototype.toString.call(reg) === '[object Object]') {
        return validate((value, source) => test(value, [reg]))
    }
    else {
        return validate((value, source) => test(value, reg))
    }
}