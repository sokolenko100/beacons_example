export default {
    server: 'https://authentiktime.com/api/v1', // http://18.232.57.43:7001/api/v1 http://127.0.0.1:7001/api/v1
    route: {
        records: {
            list: {
                path: '/records',
                method: 'GET',
            },
            myList: {
                path: '/records/my',
                method: 'GET',
            },
            detail: {
                path: '/records',
                method: 'GET',
            },
            update: {
                path: '/records',
                method: 'PUT',
            },
        },
        users: {
            CheckIn: {
                path: '/users/checkin',
                method: 'POST',
            },
            login: {
                path: '/users/login',
                method: 'POST',
            },
            logout: {
                path: '/users/logout',
                method: 'POST',
            },
            midLogin: {
                path: '/users/midLogin',
                method: 'POST',
            },
            deviceCheck: {
                path: '/users/deviceCheck',
                method: 'POST',
            },
            bindDevice: {
                path: '/users/bindDevice',
                method: 'POST',
            },
            myCheckIn: {
                path: '/users/myCheckin',
                method: 'POST',
            },
            currentUser: {
                path: '/users/currentUser',
                method: 'POST',
            },
            list: {
                path: '/users',
                method: 'GET',
            },
            children: {
                path: '/users/children',
                method: 'GET',
            },
            myCrews: {
                path: '/users/myCrews',
                method: 'GET',
            },
        },
        jobs: {
            list: {
                path: '/jobs',
                method: 'GET',
            },
            edit: {
                path: '/jobs',
                method: 'PUT',
            },
            detail: {
                path: '/jobs',
                method: 'GET',
            },
        },
        tasks: {
            list: {
                path: '/tasks',
                method: 'GET',
            },
            create: {
                path: '/tasks',
                method: 'POST',
            },
            edit: {
                path: '/tasks',
                method: 'PUT',
            },
            delete: {
                path: '/tasks',
                method: 'DELETE',
            },
        },
        crews: {
            list: {
                path: '/crews',
                method: 'GET',
            },
            create: {
                path: '/crews',
                method: 'POST',
            },
            edit: {
                path: '/crews',
                method: 'PUT',
            },
            delete: {
                path: '/crews',
                method: 'DELETE',
            },
        },
        organizations:{
            isBelong:{
                path:'/organizations/isBelong',
                method:'GET',
            },
        },
        notifications: {
            list: {
                path: '/notifications',
                method: 'GET',
            },
        },
    },
};
