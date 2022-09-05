let users = [
    {   
        id: 1,
        username: 'Dongyoung',
        password: '$2b$12$pBqKTuvf3Jj/2af0ARN0ruVVfLouxkw60ZrJ5S4aimrSd2Cl2AsiS',
        name: 'DY',
        email: 'color54642@gmail.com',
    },
    {
        id: 2,
        username: 'DDDDD',
        password: '$2b$12$pBqKTuvf3Jj/2af0ARN0ruVVfLouxkw60ZrJ5S4aimrSd2Cl2AsiS',
        name: 'DDDDD',
        email: 'color542@gmail.com',
    }
]

export async function findByUsername(username) {
    return users.find(user => user.username === username);    
}

export async function findById(id) {
    return users.find(user => user.id === id);
}

export async function createUser(user) {
    const created = {...user, id: users.length + 1};
    users.push(created);
    return created.id; 
}