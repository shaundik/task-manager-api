const Token = localStorage.getItem('loginToken')

const updateForm = document.querySelector('#update-form')
const upFormName = document.querySelector('#up-name')
const upFormEmail = document.querySelector('#up-email')
const upFormPassword = document.querySelector('#up-password')
const upFormAge = document.querySelector('#up-age')


const msg = document.querySelector('#msg1')
//msg.textContent = 'mafarsdf'

updateForm.addEventListener('submit',(e) => {
    e.preventDefault()

    const name = upFormName.value
    const email = upFormEmail.value
    const password=upFormPassword.value
    const age  =  upFormAge.value
    if(password === ''){
        console.log('empty')
        options = {
            name,email,age
        }
    }
    else{
        options = {
            name,email,password,age
        }
    }
    fetch('/users/me', {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json',
             credentials: 'same-origin',
             'Authorization': 'Bearer '+Token
        },
        body: JSON.stringify(options)
    }).then((res) => {
        if(res.status === 400){
            return document.getElementById('info').textContent = 'Bad Request: Password must be 8 char long'
        }
        return res.json()
    }).then((data) => {
        console.log(data)
        location.href = '/profile?alert=updated'
    }).catch((e) => {})
})
