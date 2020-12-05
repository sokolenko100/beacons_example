export default {
    common: {
        test: 'asd',
        pageTitle: {
            CheckInOutIndex: 'Check In/Out',
        },
    },
    components: {
        Header: {
            CommonHeaderTitle: {
                test: '',
            },
            CommonHeaderRight: {
                plannedNum: '{{num}} Planned',
                workingNum: '{{num}} Working',
            },
        },
    },
    NoData: {
        noActivity: 'No activities available.',
        noJob: 'No job information available.',
        noCrew: 'No crew information available',
        normalText: "It's empty",
    },
    ActivityIndex: {
        SelectJob: 'All Timestamps',
        SelectJobTitle: 'Select a job',
    },
    CheckInOutIndex: {
        SearchBarPlaceholder: 'Name/Employee ID',
        PasswordInputLabel: 'Password',
        CheckInOutButtonText: 'CHECK IN/OUT',
        OrCheckByAccountText: 'Or Check in/out by account',
        OrCheckByAccountButtonLabel: 'CHECK BY ACCOUNT',
    },
    AuthLogin: {
        loginButtonLabel: 'LOGIN',
        OrSwipeLogin: 'OR SWIPE TO LOGIN',
    },
    MoreIndex: {
        logout: 'Logout',
        enrollment: 'Enrollment',
        MRR: 'Manage Rates and Rules',
        TimeConfigure: 'Time Configuration',
        AlertsAndNotification: 'Alerts and Notifications',
        ProfileAndPassword: 'Profile and Password',
        MessageAlert: 'MessageAlert',
        JobsCrew: 'JobsCrew',
    },
    CrewIndex: {
        addCrew: 'ADD CREW',
    },
    EditTask: {
        AddTaskSuccess: 'Add successful !',
        SaveTaskSuccess: 'Save successful !',
        DeleteTaskSuccess: 'Delete successful !',
    },
    Notification:{
        noticeTabLeft: 'MESSAGES/ALERTS',
        noticeTabRight: 'JOBS/CREW',
        noMessage: 'No message/alert available',
    },
};
