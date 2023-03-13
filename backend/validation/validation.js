const joi = require('joi');

class Validation {
  constructor(data) {
    this.data = data;
  }
}

class RegisterValidation extends Validation {
  constructor(validationInfo) {
    super(validationInfo);
  }
  getValidationInfo() {
    return this.getValidationInfo;
  }
  schema() {
    return joi.object({

      businessName: joi.string().min(2).max(30).required(),
      // email  validation
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net',"org"] },
        })
        .required()
        .messages({
          'string.empty': ` Email field cannot be empty `,
          'object.regex': 'Email Must Be A Valid Email',
          'string.pattern.base': 'Email Must Be A Valid Email Address',
        }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          )
        )
        .min(8)
        .max(30)
        .required()
        .label('Password')
        .messages({
          'string.empty': ` password field cannot be empty `,
          'object.regex': 'Must have at least 8 characters',
          'string.pattern.base':
            'Password Must Contain Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character',
        }),
      phone: joi
        .string()

        .pattern(/^[0-9]+$/)
        .messages({
          'string.pattern.base': `Phone number must have  at least 10 digits.`,
        })
        .min(9)
        .max(13)
        .required(),
        bvn:joi
        .string()
        .pattern(/^\d{10}$/)
        .messages({
          'string.pattern.base': `BVN number must be 10 digits.`,
        })
        // .min(10)
        // .max(10)
        .required(),
    });
  }

  checkValidation() {
    let validateSchema = this.schema();
    return validateSchema.validate(this.data);
  }
}

class LoginValidation extends Validation {
  constructor(validationInfo) {
    super(validationInfo);
  }

  schema() {
    return joi.object({
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net',"org"] },
        })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          )
        )
        .min(8)
        .max(30)
        .required()
        .label('Password')
        .messages({
          'string.empty': ` password field cannot be empty `,
          'object.regex': 'Must have at least 8 characters',
          'string.pattern.base':
            'Minimum eight characters,at least one upper case,one lower case letter , one digit and  one special character,',
        }),
    });
  }
  validate() {
    let validateSchema = this.schema();
    return validateSchema.validate(this.data);
  }
}

// const result = new LoginValidation({ name: 'youls' });

module.exports = {
  RegisterValidation,
  LoginValidation,
};