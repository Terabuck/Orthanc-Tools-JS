import { toastifyError, toastifySuccess } from './toastify'
import updateOptions from '../authorizedOption'

const user = {
    getUsers(){

      const getUsersOption = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    } 

        return fetch('/users/users', updateOptions(getUsersOption)).then((answer) => {
            if (!answer.ok) { throw answer }
              return answer.json()
          }).catch(async error => {
            let errorText = await error.text()
            toastifyError(errorText)
          })
    }, 

    modifyUser(data){
      const modifyUserOption = {
        method: 'PUT', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      }

      return fetch('/users/users', updateOptions(modifyUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('User Modify with success')
      }).catch(async error => {
        let errorText = await error.text()
        toastifyError(errorText)
      })
    },

    deleteUser(username){
      const deleteUserOption = {
        method: 'DELETE', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify([username])
      }
      
      return fetch('/users/users', updateOptions(deleteUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('User Delete with success')
      }).catch(async error => {
        let errorText = await error.text()
        toastifyError(errorText)
      })
    }, 

    createUser(data){

      const createUserOption = {
        method: 'POST', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)

      }

      return fetch('/users/users', updateOptions(createUserOption)).then((answer) => {
        if (!answer.ok) { throw answer }
          toastifySuccess('user created with success')
      }).catch(async error => {
        console.log(error)
        let errorText = await error.text()
        toastifyError(errorText)
      })
    }
}

export default user