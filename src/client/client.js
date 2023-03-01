import { log } from 'debug';

const resCreate = await fetch(
  'http://localhost:9090/user',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({'name': 'Gustavo1', 'password': 'string' })
  }
)
const dataCreate = await resCreate.json()
log(
  `Create: \n Status - ${resCreate.status} \n Headers -`,
  resCreate.headers, '\n Body -', dataCreate
)

const id = dataCreate.data._id;

log('============================================================================')

const resFindAll = await fetch('http://localhost:9090/user')
const dataFindAll = await resFindAll.json()
log(
  `Find All: \n Status - ${resFindAll.status} \n Headers -`,
  resFindAll.headers, '\n Body -', dataFindAll
)

log('============================================================================')

const resFindById = await fetch(`http://localhost:9090/user/${id}`)
const dataFindById = await resFindById.json()
log(
  `Find By Id: \n Status - ${resFindById.status} \n Headers -`,
  resFindById.headers, '\n Body -', dataFindById
)

log('============================================================================')

const resUpdate = await fetch(
  `http://localhost:9090/user/${id}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'name': 'Gustavo', 'password': 'string1' })
  }
)
const dataUpdate = await resUpdate.json()
log(
  `Update: \n Status - ${resUpdate.status} \n Headers -`,
  resUpdate.headers, '\n Body -', dataUpdate
)

log('============================================================================')

const resDelete = await fetch(`http://localhost:9090/user/${id}`, {method: 'DELETE'})
const dataDelete = await resDelete.json()
log(
  `Delete: \n Status - ${resDelete.status} \n Headers -`,
  resDelete.headers, '\n Body -', dataDelete
)