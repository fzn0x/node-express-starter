module.exports.verifyObjectProperties = (object, keys) => {
    let valid = true;
    for(key of keys){
        if(!object.hasOwnProperty(key)) {
            return !valid;
        }
    }
    return valid;
}