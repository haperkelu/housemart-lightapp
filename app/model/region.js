/**
 * Created by user on 14-4-24.
 */
Model.region = function(exports){
    exports.config = {
        fields : [
            { name: 'regionId', type: 'number'},
            { name: 'regionName', type: 'string'},
            { name: 'plateList', type: 'model', relation: 'many', model: 'plate.class'}
        ]
    }
};

Model.plate = function(exports){
    exports.config = {
        fields : [
            { name: 'id', type: 'number'},
            { name: 'name', type: 'string'},
            { name: 'level', type: 'number'}
        ]
    }
}

