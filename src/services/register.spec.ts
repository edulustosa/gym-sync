import { expect, describe, it, assert } from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const user = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    assert.exists(user)
  })

  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const user = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    })

    if (user.password_hash === '12345678') {
      throw new Error('Password not hashed')
    }

    const isPasswordCorrectlyHashed = await compare(
      '12345678',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with the same e-mail twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(inMemoryUsersRepository)

    const email = 'johndoe@example.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '12345678',
    })

    expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
