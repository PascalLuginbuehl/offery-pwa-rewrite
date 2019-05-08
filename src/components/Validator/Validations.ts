const isExisty = function (value: any) {
    return value !== null && value !== undefined;
};

const isEmpty = function (value: any) {
    if (value instanceof Array) {
        return value.length === 0;
    }
    return value === '' || !isExisty(value);
};

const isEmptyTrimed = function (value: any) {
    if (typeof value === 'string') {
        return value.trim() === '';
    }
    return true;
};

const Validations = {
    matchRegexp: (value: any, regexp: RegExp) => {
        const validationRegexp = (regexp instanceof RegExp ? regexp : (new RegExp(regexp)));
        return (isEmpty(value) || validationRegexp.test(value));
    },

    // eslint-disable-next-line
    isEmail: (value: any) => Validations.matchRegexp(value, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),

    isEmpty: (value: any) => isEmpty(value),

    required: (value: any) => !isEmpty(value),

    trim: (value: any) => !isEmptyTrimed(value),

    isNumber: (value: any) => Validations.matchRegexp(value, /^-?[0-9]\d*(\d+)?$/i),

    isFloat: (value: any) => Validations.matchRegexp(value, /^(?:[1-9]\d*|0)?(?:\.\d+)?$/i),

    isPositive: (value: any) => {
        if (isExisty(value)) {
          return (Validations.isNumber(value) || Validations.isFloat(value)) && value >= 0;
        }
        return true;
    },

    maxNumber: (value: any, max: string) => isEmpty(value) || parseInt(value, 10) <= parseInt(max, 10),

    minNumber: (value: any, min: string) => isEmpty(value) || parseInt(value, 10) >= parseInt(min, 10),

    maxFloat: (value: any, max: string) => isEmpty(value) || parseFloat(value) <= parseFloat(max),

    minFloat: (value: any, min: string) => isEmpty(value) || parseFloat(value) >= parseFloat(min),

    isString: (value: any) => !isEmpty(value) || typeof value === 'string' || value instanceof String,
    minSringtringLength: (value: any, length: number) => Validations.isString(value) && value.length >= length,
    maxStLength: (value: any, length: number) => Validations.isString(value) && value.length <= length,
};

export default Validations
