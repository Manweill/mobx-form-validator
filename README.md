# mobx-form-validator
### base on [mobx-form-validate](https://github.com/tdzl2003/mobx-form-validate) and [validator](https://github.com/chriso/validator.js)

## Installation
npm i mobx-form-validator
or
yarn add mobx-form-validator

## Usage
```js
import validator from 'mobx-form-validator';

class TestModel{
  @observable
  @validator([
    {reg1,reg2,reg3,message},
    {reg1,reg2,reg3,message}
    ...
  ])
  name=''
}
```
### Explame
```js

export default class RegisterForm {
  @observable
  @validator([{
    required: true
  }])
  userName = ''

  @observable
  nickName = ''

  @observable
  @validator([{
    required: true, lengths: [1, 15], message: '请输入1-15位的密码！'
  }])
  password = ''

  @observable
  @validator([{
    custom: (target, targetValue, source) => {
      if (targetValue != source.password) {
        return message = '两次输入的密码不一样'
      }
    }
  }])
  passwordConfirm = ''


  @observable
  @validator([{
    required: true, message: "请输入邮箱地址"
  }, {
    type: 'Email', message: '请输入正确的邮箱地址！'
  }])
  email = ''

  @observable
  @validator([{
    pattern: /^1[3578]\d{9}$/, message: '请输入正确的手机号码！'
  }])
  mobilePhone = ''

  @observable
  @validator([{
     max: 200, min: 0, message: '年龄介乎0~200之间！'
  }])
  age = ''

const form = new RegisterForm();
console.log(form.validateErrorUserName);          // userName is required
console.log(form.validateErrorPassword);          // 请输入1-15位的密码
console.log(form.validateErrorPasswordConfirm);   // 两次输入的密码不一样
console.log(form.validateErrorEmail);             // 请输入正确的邮箱地址！
console.log(form.validateErrorMobilePhone);       // 请输入正确的手机号码！
console.log(form.validateErrorAge);               // 年龄介乎0~200之间！
console.log(form.isValid);                        // false
```


## API
|参数      | 说明                                            | 类型 
|---|---|---
|before    | 校验前转换,返回要转换的值，如果返回空，则取当前值   | (value) => |any
|custom    | 自定义校验，返回错误信息，如果为空则认为校验成功    | (target, |targetValue, source) => string | undefined
|lengths   | 字符串货数组长度 eg: length:[6,15]               | number[]
|max       | 最大值                                          | number
|message   | 提示信息                                        | string
|min       | 最小值                                          | number
|pattern   | 正则表达式                                      | RegExp
|required  | 是否必填                                        | boolean
|type      | 数据类型                                        | [enum Types]()

### Enum Types
`Ascii` `Base64`  `Boolean` `CreditCard`  `Currency`  `DataURI` `Decimal` `Email` `Float` `HexColor`  `Hexadecimal` `IP`  `Int` `JSON`  `MACAddress`  `Numeric` `URL` `UUID`


### custom
``` js
 /**
   * 自定义校验，返回错误信息，如果为空则认为校验成功
   * @param target 要校验的属性字段
   * @param targetValue 要检验的值
   * @param source 要校验的属性所属的对象
   */
  custom: (target, targetValue, source) => string | undefined;
```