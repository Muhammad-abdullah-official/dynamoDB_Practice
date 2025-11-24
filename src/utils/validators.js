import Joi from "joi";

export const signUpSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string()
    .pattern(/^\+?\d{7,15}$/)

    .required(),
  address: Joi.string().allow("").optional(),
  password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .required(),
  password: Joi.string().min(8).required(),
});

export const createProjectSchema = Joi.object({
  projectName: Joi.string().min(1).max(200).required(),
  duration: Joi.number().min(0).optional(),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  status: Joi.string().valid("todo", "in_progress", "done").default("todo"),
  priority: Joi.number().integer().min(1).max(5).default(3),
  assignedTo: Joi.string().allow(null).optional(),
});
