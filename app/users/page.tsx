import React from 'react'

interface IUser {
    id: string,
    name: string,
}

const UsersPage = async () => {

    const resp = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
            cache: 'no-store', // if data change frequetly ==>  SSR
            // next:{
            //     revalidate: 1 // revalidate after 10 seconds ==>  ISR
            // }
        }
        )
    const data: IUser[] = await resp.json()

    return (
        <>
        <h1>Users</h1>
        <p>{new Date().toLocaleTimeString()}</p>
            <ul>
                {
                    data.map((user: IUser) => (
                        <li key={user.id}>
                            <p>{user.name}</p>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default UsersPage