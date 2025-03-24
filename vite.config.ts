
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      ['tests/end-to-end/**', './tests/vitest-environments/prisma.ts'] //saying that the enviroment will run to each test file
    ],
    dir: 'tests'
  }
})