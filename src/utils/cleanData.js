export default function cleanData(data = []) {

    const newData = {};
    const newArr = data.filter(d => {

        if (!newData[d.ID]) {

            newData[d.ID] = d.ID;
            return d;

        }

    });
    return newArr;

}
