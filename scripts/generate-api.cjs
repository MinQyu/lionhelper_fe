const path = require('path');
const { generateApi } = require('swagger-typescript-api');

generateApi({
  name: 'api.ts',
  output: path.resolve(process.cwd(), './src/api'),
  input: path.resolve(process.cwd(), './swagger.json'),
  httpClientType: 'fetch',
  prettier: true,
  defaultResponseAsSuccess: false,
  generateClient: true,
  generateUnionEnums: true,
})
  .then(() => {
    console.log('✅ API 클라이언트 생성 완료: src/api/api.ts');
  })
  .catch(err => {
    console.error('❌ API 생성 중 오류 발생:', err);
  });
