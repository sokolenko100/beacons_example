import { observable, action } from 'mobx';
import {
    convertUserFormat,
    convertActivityFormat,
    convertJobFormat,
} from '../utils/convertDataFormat';
import { commonStore } from './common';

class ActivityIndexStore {

    @observable ActivityList = [];
    @observable isLoadingActivityList = false;

    @action.bound
    fetchLatest(page = 1, jobID, isRefresh = true, endFetch, postRefresh) {

        this.isLoadingActivityList = true;
        API.get('records.list', {
            params: {
                job_id: jobID ?? null,
                page,
            },
        })
            .then(async data => {
                this.isLoadingActivityList = false;
                if (
                    data?.status === 200 &&
                    data?.data?.code === 200 &&
                    Array.isArray(data?.data?.list)
                ) {
                    const { list, meta } = data.data;
                    const newList = list.map(record => {
                        if (record.user) {

                            modelStore.putModel(
                                'User',
                                convertUserFormat(record.user),
                            );

                        }
                        if (record.job) {

                            modelStore.putModel(
                                'Job',
                                convertJobFormat(record.job),
                            );

                        }

                        return modelStore.generateModel(
                            'Activity',
                            convertActivityFormat(record),
                        );

                    });
                    this.ActivityList = isRefresh
                        ? newList
                        : global.cleanData([...this.ActivityList, ...newList]);

                    if (postRefresh) {

                        postRefresh(this.ActivityList, meta.total);

                    }
                } else {

                    this.ActivityList = [];
                    // if (data?.data?.code === 405) {
                    //     await commonStore.logout();
                    // }
                }
                if (endFetch) {

                    endFetch();

                }

            })
            .catch(error => {

                this.isLoadingActivityList = false;
                tap(error);
                if (endFetch) {

                    endFetch();

                }

            })
            .finally(() => {

                if (endFetch) {

                    endFetch();

                }
                this.isLoadingActivityList = false;

            });

    }

    @action.bound
    fetchMyLatest(page = 1, jobID, isRefresh = true, endFetch, postRefresh) {

        API.get('records.myList', {
            params: {
                page,
            },
        })
            .then(data => {


                this.isLoadingActivityList = false;
                if (
                    data?.status === 200 &&
                    data?.data?.code === 200 &&
                    Array.isArray(data?.data?.list)
                ) {

                    const { list } = data.data;
                    const newList = list.map(record => {

                        if (record.user) {

                            modelStore.putModel(
                                'User',
                                convertUserFormat(record.user),
                            );

                        }
                        if (record.job) {

                            modelStore.putModel(
                                'Job',
                                convertJobFormat(record.job),
                            );

                        }

                        return modelStore.generateModel(
                            'Activity',
                            convertActivityFormat(record),
                        );

                    });
                    this.ActivityList = isRefresh
                        ? newList
                        : global.cleanData([...this.ActivityList, ...newList]);

                } else {

                    this.ActivityList = [];

                }
                const { meta } = data.data;

                if (postRefresh) {

                    postRefresh(this.ActivityList, meta.total);

                }
                if (endFetch) {

                    endFetch();

                }

            })
            .catch(error => {

                tap(error);
                if (endFetch) {

                    endFetch();

                }
                this.isLoadingActivityList = false;

            })
            .finally(() => {

                if (endFetch) {

                    endFetch();

                }
                this.isLoadingActivityList = false;

            });

    }

}

const activityIndexStore = new ActivityIndexStore();

export { activityIndexStore };
