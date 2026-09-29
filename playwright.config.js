import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',workers:1,use:{baseURL:'http://localhost:5174',launchOptions:process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{},trace:'retain-on-failure'},webServer:{command:'node scripts/e2e-server.mjs',url:'http://localhost:5174',reuseExistingServer:false}});
