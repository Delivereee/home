/** @type {import('jest').Config} */
const config = {
  // Create React App 기본 설정 유지하면서 확장
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  
  // node_modules 중 ESM 패키지 트랜스폼 설정
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|react-router-dom)/)"
  ],
  
  // TypeScript 처리 설정
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  
  // 모듈 이름 매핑
  moduleNameMapper: {
    "^axios$": "<rootDir>/node_modules/axios/dist/axios.js"
  },
  
  // 테스트 환경 설정
  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.ts"
  ],
  
  // 테스트 파일 패턴
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ]
};

module.exports = config; 