import swaggerAutogen from 'swagger-autogen';
import path from 'path';

const outputFile = '../../swagger-output.json';
const endpointsFiles = [path.join('../routes/routes.js')];
swaggerAutogen()(outputFile, endpointsFiles);