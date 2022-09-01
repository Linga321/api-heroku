import request from 'supertest'
import jwt_encode from 'jwt-simple'

import User, { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'
import { authUser1, authUser2 } from '../fixtures/auth'
import { user1, user2 } from '../fixtures/users'

let jwt_password = jwt_encode.encode(authUser1.password, 'secret')

async function loginUser(email?: string, password?: string) {
  return await request(app).post('/auth/login').send({
    email: email,
    password: password,
  })
}

async function userProfile(token?: string) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return await request(app).get('/auth/profile').set(headers)
}

async function logoutUser(token?: string) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  return await request(app).get('/auth/logout').set(headers)
}

describe('user controller', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })
  beforeEach(async () => {
    await User.insertMany([user1, user2])
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should login with a user info', async () => {
    const res = await loginUser(authUser1.email, jwt_password)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('should not login with a user info', async () => {
    const res = await loginUser(authUser2.email, jwt_password)
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Username or password incorrect')
  })

  it('should logout with token and update database', async () => {
    const res_token = await loginUser(authUser1.email, jwt_password)
    const res = await logoutUser(res_token.body.token)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('modifiedCount')
    expect(res.body.modifiedCount).toEqual(1)
    expect(res.body.matchedCount).toEqual(1)
  })

  it('should get user info with token', async () => {
    const res_token = await loginUser(authUser1.email, jwt_password)
    const res = await userProfile(res_token.body.token)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})
