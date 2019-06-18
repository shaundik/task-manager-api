const Token = localStorage.getItem('loginToken')

const taskForm = document.querySelector('#newtask-form')
const taskDescription = document.querySelector('#task-name')
const taskStatus = document.querySelector('#task-status')
const taskButton = document.querySelector('#task-submit-button')

if(taskButton.value === 'add'){
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const description = taskDescription.value
        let completed = false
        if(taskStatus.value == 'Completed'){
            completed = true
        }
    
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'same-origin',
                'Authorization': 'Bearer '+Token
            },
            body: JSON.stringify({
                description,
                completed
            })
        }).then((res) => {
            if(res.ok){
                location.href = '/profile?alert=taskAdded'
            }
        }).catch((err) => {
    
        })
    })
}

else{
    const id = taskButton.value
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const description = taskDescription.value
        let completed = false
        if(taskStatus.value == 'Completed'){
            completed = true
        }
    
        fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'same-origin',
                'Authorization': 'Bearer '+Token
            },
            body: JSON.stringify({
                description,
                completed
            })
        }).then((res) => {
            if(res.ok){
                location.href = '/profile?alert=taskUpdated'
            }
        }).catch((err) => {
    
        })
    })
}

