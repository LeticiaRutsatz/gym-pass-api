import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() { //before tests
    console.log('Setup')

    return {
      async teardown() { //after tests
        console.log('Teardown')
      },
    }
  },
}