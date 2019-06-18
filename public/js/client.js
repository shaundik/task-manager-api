
const logInToken = localStorage.getItem('loginToken')

document.getElementById('logout').addEventListener('click', (e) =>{
    e.preventDefault()

    fetch('/users/logout', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        console.log(res)
        if(res.ok){
            location.replace('/logout')
        }
        }).catch((e) => {
        console.log(e)
    })
})

document.getElementById('logout-all').addEventListener('click', (e) =>{
    e.preventDefault()

    fetch('/users/logoutALL', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        console.log(res)
        if(res.ok){
            location.replace('/logout?all=true')
        }
        }).catch((e) => {
        console.log(e)
    })
})

document.getElementById('user-profile').addEventListener('click', (e) => {
    e.preventDefault()

    fetch('/users/me',{
        method:'GET',
        headers: {
            'Content-Type':'application/json',
            credentials:'same-origin',
            'Authorization':'Bearer '+logInToken
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data)
        let queryString = 'name='+data.name+'&email='+data.email+'&age='+data.age
        location.href = '/users/profile?'+queryString
    }).catch((e) => {})

})



document.getElementById('create-task').addEventListener('click', (e) => {
    e.preventDefault()

    fetch('/createtask',{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        if(res.ok){
            console.log('crearte task')
            location.href = '/createtaskform'
        }
    }).catch((e)=>{

    })
})

const $taskField = document.querySelector('#task-field')
const taskTemplate = document.querySelector('#task-template').innerHTML

document.getElementById('get-tasks').addEventListener('click', (e) => {
    e.preventDefault()
    fetchTasks()
})

function fetchTasks() {

    fetch('/tasks',{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        if(res.ok){
            return res.json()
        }
    }).then((data) => {
        let result = '<h2>My Tasks</h2>'
            if(data.length === 0){
                result+= '<p>No Tasks to Display</p>'
                $taskField.innerHTML = result
            }
            else{
                data.forEach((task) => {
                    const { description, completed } = task
    
                    result +=
                        `<div>
                           <h5> Task-Name: ${description} </h5>
                           <h5> Task-Status: ${completed} </h5>
                           <button id="read-task" onclick="readTask('${task._id}')">Details</button>
                           <button id="update-task" onclick="updateTask('${description}','${task._id}')">Update</button>
                           <button class="delete-task" onclick="deleteTask('${task._id}')">Delete</button>
                           <hr>
                        </div>`
                    $taskField.innerHTML = result
                })
            }

    }).catch((e)=>{

    })
}

function deleteTask(id) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        if(res.ok){
            //document.getElementById('information').textContent = 'One task deleted'
            fetchTasks()
        }
    }).catch((e) => {

    })
}

const updateTask = (description,id) => {
    location.href = '/createtaskform?update='+description+'&id='+id
}


const readTask = (id) => {
    fetch(`/tasks/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            credentials: 'same-origin',
            'Authorization': 'Bearer '+logInToken
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        let queryString = 'task='+data.description+'&status='+data.completed+'&createdAt='+data.createdAt+'&updatedAt='+data.updatedAt
        location.href = '/taskDetails?'+queryString
    })
    .catch((e) => {

    })
}