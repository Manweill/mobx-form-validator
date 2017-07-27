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
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 最小值
   */
  min?: number;
  /**
   * 正则表达式
   */
  patten?: RegExp;
  /**
   * 长度范围
   */
  length?: number[];
  /**
   * 提示信息
   */
  message: string;
  /**
   * 数据类型
   */
  type: Types;
  /**
   * 自定义校验
   */
  validator: (target, targetValue, source) => any;
  /**
   * 校验钱转换
   */
  transform: (value) => any;
}

/**
 * 判断是否为NULL或者underfined
 * 如果v是字符串，则还要判断长度是否为0
 * @param v 要判断的参数
 */
function isEmpty(v): boolean {
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
  public static required(targetValue, value) {
    return !isEmpty(targetValue) && value;
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
  public static min(targetValue, value) {
    return targetValue < value;
  }
  /**
   * 判断类型
   * @param targetValue 要检测的目标属性
   * @param value 类型
   */
  public static type(targetValue, value: Types) {
    if (!isEmpty(targetValue) && value && validator[value]) {
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

function test(target: string, targetValue: any, source: object, rules: IRule[]) {
  for (const rule of rules) {
    const { message, validator: validFunc, transform, ...other } = rule;
    // 如果validator有值，则其他校验属性无效
    if (validFunc) {
      return rule.validator(target, targetValue, source);
    } else {
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

export default validator;
