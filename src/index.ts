import camelCase = require('camelcase');
import mobx = require('mobx');
import validator = require('validator');
const { computed } = mobx;

export type Types =
  | 'Ascii'
  | 'Base64'
  | 'Boolean'
  | 'CreditCard'
  | 'Currency'
  | 'DataURI'
  | 'Decimal'
  | 'Email'
  | 'Float'
  | 'HexColor'
  | 'Hexadecimal'
  | 'IP'
  | 'Int'
  | 'JSON'
  | 'MACAddress'
  | 'Numeric'
  | 'URL'
  | 'UUID';

export interface IRule {
  /** 全等对比 */
  compare?: string;
  /** 字符串货数组长度   */
  lengths?: number[];
  /** 最大值  */
  max?: number;
  /** 提示信息   */
  message: string;
  /** 最小值   */
  min?: number;
  /** 正则表达式   */
  pattern?: RegExp;
  /** 是否必填 */
  required?: boolean;
  /** 数据类型   */
  type?: Types;
  /** 校验前转换,返回要转换的值，如果返回空，则取当前值   */
  beforeValidate(value): any;
  /**
   *  自定义校验，返回错误信息，如果为空则认为校验成功
   * @param target 要校验的属性字段
   * @param targetValue 要检验的值
   * @param source 要校验的属性所属的对象
   */
  custom(target, targetValue, source): string | undefined;
}

/**
 * 判断是否为NULL或者underfined
 * @param v 要判断的参数
 */
function isNullOrUndefined(v): boolean {
  return v === undefined || v === null || v === '';
}

class Method {
  /**
   * 全等对比
   * @param targetValue 要检测的属性
   * @param value 要对比的属性
   * @param source 数据源
   */
  public static compare(targetValue, value, source) {
    if (!isNullOrUndefined(targetValue) && value && source[value]) {
      return targetValue === source[value];
    }
  }

  public static lengths(targetValue, value) {
    if (
      Object.prototype.toString.call(value) === '[object Array]' &&
      value.length === 2
    ) {
      return (
        !isNullOrUndefined(targetValue) &&
        targetValue.length &&
        (targetValue.length < value[0] || targetValue.length > value[1])
      );
    }
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
  public static pattern(targetValue, value) {
    return !isNullOrUndefined(targetValue)
      ? value && value.test && !value.test(targetValue)
      : false;
  }
  /**
   * 是否必填
   * @param target 要检测的目标属性
   * @param value 标准值
   */
  public static required(targetValue, value) {
    return isNullOrUndefined(targetValue) && value;
  }
  /**
   * 判断类型
   * @param targetValue 要检测的目标属性
   * @param value 类型
   */
  public static type(targetValue, value: Types) {
    const method = `is${value}`;
    if (!isNullOrUndefined(targetValue) && !!validator[method]) {
      return !validator[method](targetValue);
    }
  }
}

const Tips = {
  compare: (target, value) => `${target} is not equal to ${value}`,
  lengths: (target, value) =>
    `${target}.length must in [${value[0]},${value[1]}] `,
  max: (target, value) => `${target} maxValue is ${value} `,
  min: (target, value) => `${target} minValue is ${value} `,
  pattern: (target, value) => `${target} must match ${value} `,
  required: (target, value) => `${target} is required`,
  type: (target, value) => `${target} is typeof ${value}`,
};

function defineComputedProperty(target: any, name: string, descriptor: any) {
  Object.defineProperty(target, name, descriptor);
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

export default function(rules: IRule[]) {
  const test = (target, targetValue, source) =>
    valid(target, targetValue, source, rules);

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

function valid(
  target: string,
  targetValue: any,
  source: object,
  rules: IRule[],
) {
  for (const rule of rules) {
    const { message, custom, beforeValidate, ...other } = rule;
    // custom 自定义校验器有值
    if (custom) {
      return custom(target, targetValue, source);
    } else {
      let value = beforeValidate && beforeValidate(targetValue);
      value = value || targetValue;
      for (const reg in other) {
        if (Method[reg](value, rule[reg])) {
          return (
            message || Tips[reg](target, rule[reg]) || `${target} has error`
          );
        }
      }
    }
  }
}
