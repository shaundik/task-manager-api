const Token = localStorage.getItem('loginToken')


document.getElementById('delete-user').addEventListener('click',(e) => {
    e.preventDefault()
    if(confirmation()){
        fetch('/users/me',{
            method:'DELETE',
            headers:{
                'Content-Type': 'application/json',
                credentials: 'same-origin',
                'Authorization': 'Bearer '+Token
            }
        }).then((res) => {
            if(res.ok){
                location.href = '/?alert=userdeleted'
            }
        }).catch((e)=> {})
    }
})

function confirmation() {
    return confirm('Are you sure to delete your account')
}