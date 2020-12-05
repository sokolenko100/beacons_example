import BaseModel from './baseModel';

class Job extends BaseModel {

    address = '';
    contact_id = '';
    created_at = '';
    endDate = null;
    ex = null;
    ID = null;
    location = null;
    name = '';
    startedDate = null;
    notes = '';
    ruleID = null;
    type = '';
    version = '';
    updated_at = '';
    contact = null;
    tasks = [];
    crews = [];
    job_code = '';
    validPropList = [
        'address',
        'contact_id',
        'created_at',
        'endDate',
        'ex',
        'ID',
        'location',
        'name',
        'notes',
        'ruleID',
        'startedDate',
        'type',
        'updated_at',
        'contact',
        'tasks',
        'crews',
        'job_code',
    ];
    handleInitFunc = {
        location: this.initLocation,
    };

    constructor(props) {

        super();
        // TODO: need do validate
        this.validPropList.map(validPropName => {

            const handleFunc = this.handleInitFunc[validPropName];
            if (handleFunc) {

                this[validPropName] = handleFunc(props[validPropName]);

            } else {

                this[validPropName] = props[validPropName];

            }

        });

    }

    initLocation(prop) {

        return new Location(prop);

    }

    getID() {

        return this.ID;

    }

    getFullName() {
        return this.job_code ? (`${this.job_code  } - ${  this.name}`) : this.name;
    }

}

class Location {

    lng = '';
    lat = '';

    constructor(prop) {

        this.lat = prop?.lat;
        this.lng = prop?.lng;

    }

}

export default Job;
