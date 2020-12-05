import { action, observable } from 'mobx';

class JobsIndexStore {

    @observable taskList = [];
    @observable taskMeta = Object;
    @observable isLoadingTaskList = false;

    @action.bound
    fetchTasksList(jobId) {

        this.isLoadingTaskList = true;
        API.get('tasks.list', {
            params: {
                job_id: jobId ?? '',
            },
        })
            .then(data => {

                if (
                    data?.status === 200 &&
                    data?.data?.code === 200 &&
                    Array.isArray(data?.data?.list)
                ) {

                    const { list, meta } = data.data;
                    this.meta = meta;
                    this.taskList = list;
                    // meta.page === 1 ? list : this.taskList.concat(list);
                    // this.changePageWithRequestState(true);

                } else {

                    this.taskList = [];
                    // this.changePageWithRequestState(false);

                }

            })
            .catch(error => {

                this.taskList = [];
                tap(error);
                // this.changePageWithRequestState(false);

            })
            .finally(() => {

                this.isLoadingTaskList = false;

            });

    }

    @observable editJobSuccess = false;

    @action.bound
    fetchEditJob(jobId, notes) {

        this.isPostingTask = true;
        API.get('jobs.edit', {
            data: {
                notes: notes ?? '',
            },
            subPath: `/${jobId}`,
        })
            .then(data => {

                if (data.status === 200 && data.data.code === 200) {

                    this.isPostingTask = true;
                    this.editJobSuccess = true;

                }

            })
            .catch(error => {

                tap(error);

            })
            .finally(() => {

                this.isPostingTask = false;

            });

    }

    @observable isPostingTask = false;
    @observable createTaskSuccess = false;

    @action.bound
    fetchAddTask(jobId, title) {

        this.isPostingTask = true;

        API.get('tasks.create', {
            data: {
                job_id: jobId ?? '',
                title: title ?? '',
            },
        })
            .then(data => {

                if (data.status === 201 && data.data.code === 200) {

                    this.isPostingTask = false;
                    this.createTaskSuccess = true;

                }

            })
            .catch(error => {

                tap(error);

            })
            .finally(() => {

                this.isPostingTask = false;

            });

    }

    @action.bound
    fetchEditTask(taskId, taskTitle) {

        this.createTaskSuccess = false;
        this.isPostingTask = true;

        API.get('tasks.edit', {
            data: {
                title: taskTitle,
            },
            subPath: `/${taskId}`,
        })
            .then(data => {

                if (data.status === 200 && data.data.code === 200) {

                    this.isPostingTask = false;
                    this.createTaskSuccess = true;

                }

            })
            .catch(error => {

                tap(error);

            })
            .finally(() => {

                this.isPostingTask = false;

            });

    }

    @action.bound
    fetchDeleteTask(taskId) {

        this.createTaskSuccess = false;
        this.isPostingTask = true;

        API.get('tasks.delete', {
            subPath: `/${taskId}`,
        })
            .then(data => {

                if (data.status === 200 && data.data.code === 200) {

                    this.isPostingTask = false;
                    this.createTaskSuccess = true;

                }

            })
            .catch(error => {

                tap(error);

            })
            .finally(() => {

                this.isPostingTask = false;

            });

    }

    @action.bound
    changeTaskPostTag(isSuccess) {

        this.createTaskSuccess = isSuccess;

    }

    @action.bound
    changeEidtJobTag(isSuccess) {

        this.editJobSuccess = isSuccess;

    }

    @action.bound
    changePageWithRequestState(isSuccess) {

        if (isSuccess) {

            this.page += 1;

        } else {

            this.page -= 1;

        }

    }

    @action.bound
    resetTaskListPage() {

        this.page = 1;

    }

}

const jobsIndexStore = new JobsIndexStore();

export { jobsIndexStore };
