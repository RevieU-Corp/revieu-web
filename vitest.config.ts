// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // 加上这行，启用浏览器模拟环境
        environment: 'jsdom',

        // 如果你还需要用 jest-dom 的断言（比如 toBeInTheDocument），可能还需要 setupFiles
        // setupFiles: './src/setupTests.ts', 
    },
});