import request from 'supertest'

import { UserDocument } from '../../src/models/User'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'
import { user1 ,user2} from '../fixtures/users'
import Address from '../../src/models/Address'
import { address1, address2, address3 } from '../fixtures/address'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

async function createUser(user: Partial<UserDocument>) {
  return await request(app).post('/users').send(user)
}

async function updateUser(userId: string, user: Partial<UserDocument>) {
  return await request(app).post(`/users${userId}`).send(user)
}

describe('user controller', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })
  beforeEach(async () => {
    await Address.insertMany([address1, address2, address3])
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  // it('should create a user', async () => {
  //   const res = await createUser(user1)
  //   expect(res.status).toBe(200)
  //   expect(res.body).toHaveProperty('_id')
  //   expect(res.body.firstName).toBe(user1.firstName)
  // })

  // it('should get back an existing user', async () => {

  //   const userId = user1._id
  //   const res = await request(app).get(`/users/${userId}`)
  //   expect(res.body._id).toEqual(userId)
  // })

  // it('should not get back a non-existing user', async () => {
  //   const res = await request(app).get(`/users/${nonExistingUserId}`)
  //   expect(res.status).toBe(404)
  // })

  it('should get back all user', async () => {
    const res1 = await createUser(user1)
    const res2 = await createUser(user2)
    const res3 = await request(app).get('/users')
    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  // it('should update an existing user', async () => {

  //   const res3 = await request(app).get('/users')
  
  //   expect(res.status).toBe(200)

  //   const userId = res.body._id
  //   const update = {
  //     name: 'Angrybirds 1',
  //     publishedYear: 2016,
  //   }

  //   res = await request(app).put(`/users/${userId}/address`).send(update)

  //   expect(res.status).toEqual(200)
  //   expect(res.body.name).toEqual('Angrybirds 1')
  //   expect(res.body.publishedYear).toEqual(2016)
  // })

 
})