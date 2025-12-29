import { Router, Request, Response, NextFunction } from 'express';
import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { ZodType } from 'zod';
import { registry } from '../../lib/openApiRegistry'; 
import { validateQuery, validateParams, validateBody } from '../../middleware/zodValidation';

// Define Config interface: Inherite, but for passing controller
interface AppRouteConfig extends RouteConfig {
  controller: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<any> | any;
}

export function registerRoute(router: Router, config: AppRouteConfig) {
  // parse controller and OpenAPI settings from the config
  const { controller, ...openApiConfig } = config;

  // Auto correct route format (Express ":id" -> Swagger "{id}")
  // Keep Express format when writing route 
  const swaggerPath = openApiConfig.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
  
  // 3. Register to Swagger Registry
  registry.registerPath({
    ...openApiConfig,
    path: swaggerPath,
  });

  // 4. Build Middleware chain
  const middlewares = [];

  // [Automation] If there are Query Schema in config use validateQuery
  if (openApiConfig.request?.query) {
    middlewares.push(validateQuery(openApiConfig.request.query as ZodType));
  }

  if (openApiConfig.request?.params) {
    middlewares.push(validateParams(openApiConfig.request.params as ZodType));
  }

  if (openApiConfig.request?.body) {
    const bodyConfig = openApiConfig.request.body;
    
    // ⚠️ Need to assign 'application/json' or other formats (JSON, XML, Form Data...etc.) that wraps the body
    const jsonSchema = bodyConfig.content['application/json']?.schema;

    if (jsonSchema) {
      middlewares.push(validateBody(jsonSchema as ZodType)); 
    } else {
        console.warn(`[Warning] Route ${openApiConfig.path} defines a body but no application/json schema found.`);
    }
  }

  // 5. Load Controller
  middlewares.push(controller);

  // 6. Register to Express Router
  const method = openApiConfig.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
  router[method](openApiConfig.path, ...middlewares);
}