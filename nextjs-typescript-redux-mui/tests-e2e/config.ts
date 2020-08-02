const { E2E_TEST_HEADLESS, E2E_TEST_BASE_URL } = process.env;

export const config = {
  headless: E2E_TEST_HEADLESS !== 'false',
  baseUrl: E2E_TEST_BASE_URL || 'https://localhost:3000'
};
