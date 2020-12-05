import API from './API';
import {
    convertJobFormat,
    convertUserFormat,
} from '../utils/convertDataFormat';
const convertType = {
    job: convertJobFormat,
    user: convertUserFormat,
};
export default async function AsyncRequest(
    apiName,
    params = null,
    subPath = '',
    data = null,
) {

    return new Promise((resolve, reject) => {
        console.log('apiName, { params, subPath, data }: ', apiName, { params, subPath, data });
        API.get(apiName, { params, subPath, data })
            .then(data => {
                console.log(data)
                if (
                    data?.status !== 200 ||
                    data?.data?.code !== 200 ||
                    !data?.data
                ) {

                    if (data.data && data.data.model) {

                        resolve(data.data.model);
                        return;

                    }
                    console.log('data.data ');

                    tap(data);
                    resolve(data.data);

                }
                resolve(data.data);

            })
            .catch(error => {

                console.log('.catch(error => { ');

                tap(error);
                resolve(false);

            })
            .finally(() => resolve(false));

    });

}
