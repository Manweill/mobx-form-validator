# mobx-form-validation
extends [mobx-form-validate](https://github.com/tdzl2003/mobx-form-validate)

## Installation


## API
#### @validation({reg,msg})
#### @validation([{reg,msg},{reg,msg}...])
#### @validation((value,source)=>{fn...})
method fn return regs

## Usage
### example 1
```js
class TestModel {
  @observable
  @validation([
    { required: true,messaeg:'required!' },
    { max: 99, min: 11, message: 'The age range was 11-99 years old' }
  ])
  age
}
```

### example 2
```js
class TestModel {
  max = 99

  min =1

  @observable
  @validation((value,source)=>{
      return [{
           max: source.max, min: source.min, message: 'The age range was 11-99 years old' 
      }]
  })
  age
}
```

## rules

#### type
- Ascii
- Base64
- Boolean
- CreditCard
- Currency
- DataURI
- Decimal
- Email
- Float
- HexColor
- Hexadecimal
- IP
- Int
- JSON
- MACAddress
- Numeric
- URL
- UUID
#### required
#### max
#### min
#### pattern
#### length
