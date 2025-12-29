
// src/lib/zodSetup.ts

import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI features (run this once in the app lifecycle)
extendZodWithOpenApi(z);