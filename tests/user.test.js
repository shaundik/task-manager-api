const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name:'naman',
        email:'naman@eg.com',
        password:'naman123'
    }).expect(201)

    //assert that database is changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assert the response body
    expect(response.body).toMatchObject({
        user:{
            name:'naman',
            email:'naman@eg.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('naman123')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email:'wrong email',
        password:'wrong password'
    }).expect(400)
})

test('Should get profile of user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile of user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account of user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})

test('Should not delete account of unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/philly.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fiekld', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'mike'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toBe('mike')

})

test('Should not update invalid user fiekld', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location:'delhi'
        })
        .expect(400)

})