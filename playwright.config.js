const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  use: {
    headless: false,
  },

projects: [
  {
    name: 'Chromium',
    use: { browserName: 'chromium' },
  },
  
],

});
