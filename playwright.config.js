const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  use: {
    headless: true,
  },

projects: [
  {
    name: 'Chromium',
    use: { browserName: 'chromium' },
  },
  
],

});
