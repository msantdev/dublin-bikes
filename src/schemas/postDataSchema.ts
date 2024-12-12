import Joi from 'joi';

export const postDataSchema = Joi.object({
  where: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({
        eq: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()),
        lt: Joi.number(),
        gt: Joi.number(),
        not: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()),
      })
    )
    .required(),
  orderBy: Joi.object({
    field: Joi.string().required(),
    direction: Joi.string().valid('asc', 'desc').required(),
  }).optional(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
});
