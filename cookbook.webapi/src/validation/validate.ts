export type Schema = {
    fields: { [key: string]: string }
    required?: string[]
}

// required fields for validator
const required = (obj: any, required: string[]) => {
    for (let key of required) {
        if (obj[key] === undefined) return false;
    }

    return true;
}

// validator for http request body
export const validate = async (obj: any, model: Schema) => {
    if (model.required) {
        const status = required(obj, model.required);

        if (!status) return false;
    }

    for (let key of Object.keys(obj)) {
        if (model.fields[key] === undefined) return false;
        else if (typeof obj[key] !== model.fields[key]) return false;
    }

    return true;
}