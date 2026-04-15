import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(8050),
  
  // Render Postgres
  DATABASE_URL: Joi.string().uri().allow(''),
  DB_HOST: Joi.string().hostname().allow(''),
  DB_PORT: Joi.number().default(5433),
  DB_USER: Joi.string().allow('').default('postgres'),
  DB_PASSWORD: Joi.string().allow('').default('postgres'),
  DB_NAME: Joi.string().allow('').default('postgress-seats'),
  
  JWT_SECRET: Joi.string().min(32).allow('').default('dev-secret'),
  FRONTEND_URL: Joi.string().uri().allow(''),
}).unknown();

export const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false });
  
  if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach((detail) => {
      console.error(`  ${detail.message}`);
    });
    throw new Error('Invalid environment variables');
  }
  
  console.log('✅ Environment validated');
  
  // Log sensitive info safely
  // DB: require either DATABASE_URL or all DB_* vars
  const hasDbUrl = !!value.DATABASE_URL;
  const hasDbVars = value.DB_HOST && value.DB_USER && value.DB_PASSWORD && value.DB_NAME;
  if (!hasDbUrl && !hasDbVars) {
    console.warn('⚠️  No complete DB config found (set DATABASE_URL or DB_* vars)');
  }
  console.log('DB config:', hasDbUrl ? 'DATABASE_URL' : (hasDbVars ? 'DB_* vars' : 'incomplete'));
  console.log('JWT_SECRET:', value.JWT_SECRET ? `Set (${value.JWT_SECRET.length} chars)` : 'Using dev fallback');
};

