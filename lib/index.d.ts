import validator = require('validator');
export declare enum Types {
    Ascii = "isAscii",
    Base64 = "isBase64",
    Boolean = "isBoolean",
    CreditCard = "isCreditCard",
    Currency = "isCurrency",
    DataURI = "isDataURI",
    Decimal = "isDecimal",
    Email = "isEmail",
    Float = "isFloat",
    HexColor = "isHexColor",
    Hexadecimal = "isHexadecimal",
    IP = "isIP",
    Int = "isInt",
    JSON = "isJSON",
    MACAddress = "isMACAddress",
    Numeric = "isNumeric",
    URL = "isURL",
    UUID = "isUUID",
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
export declare function getValidateError(): any;
export declare function getIsValid(): boolean;
/**
 * @param reg 校验规则
 * @param msg 全局提示信息
 */
declare function validator(rules: IRule[]): (target: any, name: any, args: any) => void;
export default validator;
