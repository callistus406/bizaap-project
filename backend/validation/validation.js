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

  schema() {
    return joi.object({
      businessName: joi.string().min(2).max(30).required(),
      // email  validation
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net', 'org'] },
        })
        .required()
        .messages({
          'string.empty': ` Email field cannot be empty `,
          'object.regex': 'Email Must Be A Valid Email',
          'string.pattern.base': 'Email Must Be A Valid Email Address',
        }),
      password: joi
        .string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
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
          tlds: { allow: ['com', 'net', 'org'] },
        })
        .required(),
      password: joi
        .string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
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

class CardPaymentValidation extends Validation {
  constructor(validationInfo) {
    super(validationInfo);
  }

  schema() {
    return joi.object({
      email: joi
        .string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ['com', 'net', 'org', 'it'] },
        })
        .required(),

      card_number: joi
        .string()

        .pattern(/^[0-9]+$/)
        .messages({
          'string.pattern.base': `Card number must have  15 digits.`, //TODO: change to 15 in production mode
        })
        .min(16)
        .max(20)
        .required(),
      cvv: joi
        .string()
        .pattern(/^\d{3}$/)
        .messages({
          'string.pattern.base': `CVV number must have  3 digits.`,
        })
        .required(),
      amount: joi.number().required(),
      fullname: joi.string().required(),
      phone_number: joi
        .string()
        .pattern(/^(\+?\d{1,3}[- ]?)?\d{11}$/) // Phone number regular expression pattern
        .messages({
          'string.pattern.base': `phone number must have  11 digits.`,
        })
        .required(),
      expiry_month: joi
        .string()
        .pattern(/^\d{2}$/)
        .messages({
          'string.pattern.base': `Expiry month  must have  2 digits.`,
        })
        .required(),
      expiry_year: joi
        .string()
        .pattern(/^\d{2}$/)
        .messages({
          'string.pattern.base': `Expiry  month must have  2 digits.`,
        })
        .required(),
    });
  }

  validate() {
    let validateSchema = this.schema();
    // console.log(validateSchema);
    return validateSchema.validate(this.data);
  }
}

class WithdrawalValidation extends Validation {
  constructor(validationInfo) {
    super(validationInfo);
  }

  schema() {
    return joi.object({
      account_bank: joi
        .string()
        .pattern(/^\d{3}$/)
        .messages({
          'string.pattern.base': `Bank code number must be  3 digits.`,
        })
        .required(),
      amount: joi.number().required(),
      narration: joi.string().required(),
      account_number: joi
        .string()
        .pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/) // acct number regular expression pattern
        .messages({
          'string.pattern.base': `account number must have  10 digits.`,
        })
        .required(),
    });
  }

  validate() {
    let validateSchema = this.schema();
    // console.log(validateSchema);
    return validateSchema.validate(this.data);
  }
}

class ProfileValidator extends Validation {
  constructor(validationInfo) {
    super(validationInfo);
  }

  schema() {
    return joi.object({
      phone: joi
        .string()
        .pattern(/^(\+?\d{1,3}[- ]?)?\d{11}$/) // Phone number regular expression pattern
        .messages({
          'string.pattern.base': `phone number must have  11 digits.`,
        }),

      businessName: joi.string().min(4).required(),
    });
  }

  validate() {
    let validateSchema = this.schema();
    // console.log(validateSchema);
    return validateSchema.validate(this.data);
  }
}

module.exports = {
  RegisterValidation,
  LoginValidation,
  CardPaymentValidation,
  WithdrawalValidation,
  ProfileValidator,
};
// return next(createCustomError(response, 400));
