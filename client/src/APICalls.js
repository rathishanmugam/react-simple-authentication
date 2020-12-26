import axios from 'axios'
import {Subject} from 'rxjs';

const subject = new Subject();
const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

export const getAuthStatusListener = () => {
    return subject.asObservable();
}
axiosInstance.interceptors.response.use(
    res => {

        return res;
    },
    error => {
        return Promise.reject(error.response)
    }
);

export const signout = () => {
    console.log('I AM IN LOGOUT FORM====>',);
    return axiosInstance.post('/logout').then(user => {
        subject.next(false);

        return user.data
    })
        .catch((err) => {
            console.log('I AM IN ERROR LOOP IN AXIOS');
            return err;
        });
}


export const init = () => {
    console.log('I AM IN INIT ========>');
    return axiosInstance.post('/init').then(user => {
        subject.next(true);
        return user.data
    })
}

export const loginForm = (email, password) => {
    console.log('I AM IN LOGIN FORM====>', email, password);
    return axiosInstance.post('/login', {
        email,
        password
    }).then(user => {
        console.log('AXIOS RESULT ====>', user)
        subject.next(true);
        user = user.data;
        return user
    })
        .catch((err) => {
            console.log('I AM IN CATCH LOOP IN AXIOS');
            return err;
        });
}

export const signup = (name, email, password) => {
    console.log('I AM IN SIGN UP FORM =======>', name, email, password);
    return axiosInstance.post('/signup', {
        name,
        email,
        password
    }).then(user => {
        subject.next(false);
        return user.data
    })
}

// export const addTodo = (title, description) => {
//     return axiosInstance.post('/todo/add', {
//         title,
//         description
//     }).then(todo => {
//         return todo.data
//     })
// }
//
// export const listTodo = () => {
//     //I have used post instead of get, read https://blog.teamtreehouse.com/the-definitive-guide-to-get-vs-post
//     return axiosInstance.post('/todo/list').then(todos => {
//         return todos.data
//     })
// }
//
//
// export const updateTodo = (_id, important = null, done = null) => {
//     //I have used post instead of get, read https://blog.teamtreehouse.com/the-definitive-guide-to-get-vs-post
//     const fieldsToUpdate = {
//         _id
//     }
//
//     if (important !== null) {
//         fieldsToUpdate.important = important
//     }
//     if (done !== null) {
//         fieldsToUpdate.done = done
//     }
//     return axiosInstance.patch('/todo/update', fieldsToUpdate).then(todo => {
//         return todo.data
//     })
// }
//
//
// export const deleteTodo = (_id) => {
//     //I have used post instead of get, read https://blog.teamtreehouse.com/the-definitive-guide-to-get-vs-post
//     return axiosInstance.delete('/todo/delete', {
//         data: {
//             _id,
//         }
//     }).then(todo => {
//         return todo
//     })
// }
