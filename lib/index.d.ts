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
    pattern?: RegExp;
    /** 字符串货数组长度   */
    lengths?: number[];
    /** 提示信息   */
    message: string;
    /** 数据类型   */
    type?: Types;
    /** 自定义校验，返回错误信息，如果为空则认为校验成功   */
    custom: (target, targetValue, source) => string | undefined;
    /** 校验前转换,返回要转换的值，如果返回空，则取当前值   */
    before: (value) => any;
}
export declare function getValidateError(): any;
export declare function getIsValid(): boolean;
/**
 * @param reg 校验规则
 * @param msg 全局提示信息
 */
export default function (rules: IRule[]): (target: any, name: any, args: any) => void;
