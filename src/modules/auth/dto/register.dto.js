import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).allow('').default('User').messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required'
  })
});

export const registerDto = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
