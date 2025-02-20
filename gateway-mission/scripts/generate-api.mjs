import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'Api.ts',
    output: resolve(process.cwd(), './src/api'),
    url: 'https://localhost:8000/swagger/?format=openapi',
    httpClientType: 'axios',
});