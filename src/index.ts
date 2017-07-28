import camelCase = require('camelcase');
import mobx = require('mobx');
import validator = require('validator');
const { computed } = mobx;

export enum Types {
  Ascii = 'isAscii',
  Base64 = 'isBase64',
  Boolean = 'isBoolean',
  CreditCard = 'isCreditCard',
  Currency = 'isCurrency',
  DataURI = 'isDataURI',
  Decimal = 'isDecimal',
  Email = 'isEmail',
  Float = 'isFloat',
  HexColor = 'isHexColor',
  Hexadecimal = 'isHexadecimal',
  IP = 'isIP',
  Int = 'isInt',
  JSON = 'isJSON',
  MACAddress = 'isMACAddress',
  Numeric = 'isNumeric',
  URL = 'isURL',
  UUID = 'isUUID',
}

export interface IRule {
  /** 是否必填 */
  required?: boolean;
  /** 最大值  */
  max?: number;
  /** 最小值   */
  min?: number;
  /** 正则表达式   */
  patten?: RegExp;
  /** 长度范围   */
  len?: number[];
  /** 提示信息   */
  message: string;
  /** 数据类型   */
  type?: Types;
  /** 自定义校验   */
  validator: (target, targetValue, source) => any;
  /** 校验前转换   */
  beforeValid: (value) => any;
}

/**
 * 判断是否为NULL或者underfined
 * 如果v是字符串，则还要判断长度是否为0
 * @param v 要判断的参数
 */
function isNullOrUndefined(v): boolean {
  return v === undefined || v === null;
}

class Method {
  /**
   * 是否必填
   * @param target 要检测的目标属性
   * @param value 标准值
   */
  public static required(targetValue, value) {
    return (isNullOrUndefined(targetValue) || targetValue === '') && value;
  }

  /**
   * 最大值
   * @param targetValue 要检测的目标属性
   * @param value 标准值
   */
  public static max(targetValue, value) {
    return targetValue > value;
  }

  /**
   * 最小值
   * @param targetValue 要检测的目标属性
   * @param value 标准值
   */
  public static min(targetValue, value: number) {
    return targetValue < value;
  }
  /**
   * 正则表达式
   * @param targetValue 要检测的目标属性
   * @param value 标准值
   */
  public static patten(targetValue, value) {
    return !isNullOrUndefined(targetValue) && value && value.test && !value.test(targetValue);
  }

  public static len(targetValue, value) {
    if (Object.prototype.toString.call(value) === '[object Array]' && value.length === 2) {
      return !isNullOrUndefined(targetValue)
        && targetValue.length
        && (targetValue.length <= value[0] || targetValue.length <= value[1]);
    }
  }
  /**
   * 判断类型
   * @param targetValue 要检测的目标属性
   * @param value 类型
   */
  public static type(targetValue, value: Types) {
    if (!isNullOrUndefined(targetValue) && value && validator[value]) {
      return !validator[value](targetValue);
    }
  }
}

function defineComputedProperty(target: any, name: string, descriptor: any) {
  Object.defineProperty(
    target,
    name,
    descriptor,
  );
  computed(target, name, descriptor);
}

export function getValidateError() {
  return this.constructor.__validateFields.find((key: string) => this[key]);
}

export function getIsValid() {
  return !this.validateError;
}

/**
 * @param reg 校验规则
 * @param msg 全局提示信息
 */
function validator(rules: IRule[]) {
  const test = (target, targetValue, source) => valid(target, targetValue, source, rules);

  return (target, name, args) => {
    const validateName = camelCase('validateError', name);
    const descriptor = {
      configurable: true,
      enumerable: false,
      get: function getter() {
        return test(name, this[name], this);
      },
    };

    defineComputedProperty(target, validateName, descriptor);

    const clazz = target.constructor;

    if (clazz.hasOwnProperty('__validateFields')) {
      clazz.__validateFields.push(validateName);
    } else {
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

function valid(target: string, targetValue: any, source: object, rules: IRule[]) {
  for (const rule of rules) {
    const { message, validator: validFunc, beforeValid, ...other } = rule;
    // 如果validator有值，则其他校验属性无效
    if (validFunc) {
      return rule.validator(target, targetValue, source);
    } else {
      let value = beforeValid && beforeValid(targetValue);
      value = value || targetValue;
      for (const reg in other) {
        if (Method[reg](value, rule[reg])) {
          return message || 'error';
        }
      }
    }
  }
}

export default validator;
