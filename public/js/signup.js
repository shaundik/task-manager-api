const signupForm = document.querySelector('#signup-form')
const signupFormName = document.querySelector('#signup-name')
const signupFormEmail = document.querySelector('#signup-email')
const signupFormPassword = document.querySelector('#signup-password')
const signupFormAge = document.querySelector('#signup-age')


const msg = document.querySelector('#msg1')
//msg.textContent = 'mafarsdf'

signupForm.addEventListener('submit',(e) => {
    e.preventDefault()

    const name = signupFormName.value
    const email = signupFormEmail.value
    const password=signupFormPassword.value
    const age  =  signupFormAge.value
    fetch('/users', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password,
            age
        })
    }).then((res) => {
        res.json().then((data) => {
            if(!data){
                return console.log('no object returned')
            }
            console.log(data)
            console.log(data.token.toString())
            localStorage.setItem('loginToken',data.token.toString())
            if(data.token){
                location.href = '/profile?alert=login&name='+data.user.name
            }
        })
    }).catch((e) => {
        console.log(e)
    })
})