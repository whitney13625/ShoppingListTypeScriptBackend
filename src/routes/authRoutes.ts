// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerRoute } from '../schemas/helper/routeRegistryHelper';
import * as authSchemas from '../schemas/authSchemas';
import * as authController from '../controllers/authController';

const router = Router();

// POST /api/auth/register
registerRoute(router, {
  method: 'post',
  path: '/api/auth/register',    
  tags: ['Auth'], 
  summary: 'Register an account',
  description: '',
  
  request: {
    query: authSchemas.RegisterSchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: authSchemas.UserSchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: authController.register, 
});


// POST /api/auth/login
registerRoute(router, {
  method: 'post',
  path: '/api/auth/login',    
  tags: ['Auth'], 
  summary: 'Sign in to your account',
  description: '',
  
  request: {
    query: authSchemas.LoginSchema, 
  },
  
  responses: {
    200: {
      description: 'Successful response',
      content: { 'application/json': { schema: authSchemas.AuthResponseSchema} }, 
    },
    500: {
      description: 'Internal Server Error'
    }
  },
  controller: authController.login, 
});

export default router;