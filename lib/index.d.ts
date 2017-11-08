export declare type Types = 'Ascii' | 'Base64' | 'Boolean' | 'CreditCard' | 'Currency' | 'DataURI' | 'Decimal' | 'Email' | 'Float' | 'HexColor' | 'Hexadecimal' | 'IP' | 'Int' | 'JSON' | 'MACAddress' | 'Numeric' | 'URL' | 'UUID';
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
    beforeValidate(value: any): any;
    /**
     *  自定义校验，返回错误信息，如果为空则认为校验成功
     * @param target 要校验的属性字段
     * @param targetValue 要检验的值
     * @param source 要校验的属性所属的对象
     */
    custom(target: any, targetValue: any, source: any): string | undefined;
}
export declare function getValidateError(): any;
export declare function getIsValid(): boolean;
/**
 * @param reg 校验规则
 * @param msg 全局提示信息
 */
export default function (rules: IRule[]): (target: any, name: any, args: any) => void;
