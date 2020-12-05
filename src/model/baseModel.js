class baseModel {
    get(propName) {
        if (propName.includes('.')) {
            const [dep, ...prop] = propName.split('.');
            const id = this[`${dep}ID`];
            if (!id) {
                return null;
            }
            return this.getDepProp(id, [dep, prop.join('.')]);
        }
        if (this.validPropList.includes(propName)) {
            return this[propName];
        }
    }
    getDepProp(id, [dep, propName]) {
        const model = modelStore.getModel(dep, id);
        return model.get(propName);
    }
}
export default baseModel;
