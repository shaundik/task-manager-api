const signupForm = document.querySelector('#signup-form')
const signupFormName = document.querySelector('#signup-name')
const signupFormEmail = document.querySelector('#signup-email')
const signupFormPassword = document.querySelector('#signup-password')
const signupFormAge = document.querySelector('#signup-age')


const msg = document.querySelector('#signupinfo')
msg.textContent = 'Password must be 8 charracters long'

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
        if(res.status === 400){
            return msg.textContent = 'Password is too small, please try again'
        }
        return res.json()
    }).then((data) => {
        localStorage.setItem('loginToken',data.token.toString())
        if(data.token){
            location.href = '/profile?alert=login&name='+data.user.name
        }
    })
    .catch((e) => { })
})
