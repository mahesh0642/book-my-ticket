import JOi from "joi";

class BaseDTO{
    static schema =  JOi.Object({})

    static validate(data){
        const {error, value}= this.schema.validate(data,{
            abortEarly: false, //return all errors, not just the first one
            stripUnknown: true //remove fields that are not defined in the schema
        })
        if(error){
            const errors = error.details.map((d)=>d.message)
            return {errors, value: null}
        }
        return {errors: null, value}    
    }
}
export default BaseDTO;