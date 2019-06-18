const loginForm = document.querySelector('#login-form')
const loginFormEmail = document.querySelector('#login-email')
const loginFormPassword = document.querySelector('#login-password')


loginForm.addEventListener('submit',(e) => {
    e.preventDefault()

    const email = loginFormEmail.value
    const password= loginFormPassword.value
    fetch('/users/login', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then((res) => {
        if(res.status === 400){
            return document.getElementById('loginInfo').textContent = 'Email or Password is incorrect'
        }
        return res.json()
    })
    .then((data) => {
        localStorage.setItem('loginToken', data.token.toString())
        if(data.token){
            location.href = '/profile?alert=login&name='+data.user.name
        }
    })
    .catch((e) => { })
})
