import { ObjectMapperOptions } from "./ObjectMapperOptions";
import { IJsonMetaData } from "./JsonProperty";
import * as normalizeWhitespace from "normalize-html-whitespace"

export class MapperHandle {

    static deserialize<T>(clazz: { new(): T }, jsonObject: any, optionsMapper?: ObjectMapperOptions) {
        if ((clazz === undefined) || (jsonObject === undefined)) return undefined;

        if(Array.isArray(jsonObject)) {
            const result = jsonObject.map(j => this.deserialize(clazz, j, optionsMapper))
            if(optionsMapper && optionsMapper.singleResult) {
                return result[0]
            }
            return result
        }

        if(this.isPrimitive(jsonObject)) {
            if(this.IsValidJSONString(jsonObject)) {
                jsonObject = JSON.parse(jsonObject)
            } else {
                return undefined
            }
        }

        let obj = new clazz();

        if(optionsMapper && optionsMapper.compareWithAttributesLowerCase) {
            jsonObject = this.toLowerCaseAllAttributes(jsonObject)
        }

        Object.keys(obj).forEach((key) => {
            let propertyMetadataFn: (IJsonMetaData) => any = (propertyMetadata: IJsonMetaData<T>) => {
                let propertyName = optionsMapper && optionsMapper.ignoreJsonPropertyName ? key : propertyMetadata.name || key;
                let innerJson = undefined;
                innerJson = jsonObject ? jsonObject[this.getKey(propertyName, optionsMapper)] : undefined;
                let clazz = this.getClazz(obj, key);
                if(propertyMetadata.clazz) {
                    let objectTarget = propertyMetadata.linear ? jsonObject : innerJson
                    if(propertyMetadata.alwaysArray) {
                        if(objectTarget) {
                            objectTarget = Array.isArray(objectTarget) ? objectTarget : [ objectTarget ]
                        } else {
                            objectTarget = []
                        }
                    }
                    return this.deserialize(propertyMetadata.clazz, objectTarget , optionsMapper);
                } else if (!this.isPrimitive(clazz) && !propertyMetadata.name) {
                    return this.deserialize(clazz, innerJson, optionsMapper);
                } else {
                    return jsonObject ? jsonObject[this.getKey(propertyName, optionsMapper)] : undefined;
                }
            };

            let propertyMetadata: IJsonMetaData<T> = this.getJsonProperty(obj, key);
            if (propertyMetadata) {
                obj[key] = this.getValue(propertyMetadataFn(propertyMetadata), optionsMapper)
            } else {
                if (jsonObject && jsonObject[key.toLowerCase()] !== undefined) {
                    obj[key] = this.getValue(jsonObject[this.getKey(key, optionsMapper)], optionsMapper)
                }
            }
        });

        return obj;
    }

    private static isPrimitive(obj) {
        switch (typeof obj) {
            case "string":
            case "number":
            case "boolean":
                return true;
        }
        return !!(obj instanceof String || obj === String ||
            obj instanceof Number || obj === Number ||
            obj instanceof Boolean || obj === Boolean);
    }

    private static getClazz(target: any, propertyKey: string): any {
        return Reflect.getMetadata("design:type", target, propertyKey)
    }

    private static getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
        return Reflect.getMetadata("jsonProperty", target, propertyKey);
    }

    private static toLowerCaseAllAttributes(obj: any) {
        var key, keys = Object.keys(obj);
        var n = keys.length;
        var newobj = {}
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = obj[key];
        }
        return newobj
    }


    private static getValue(value: any, options: ObjectMapperOptions) {
        if(options && options.normalizeString && typeof value == "string") {
            return normalizeWhitespace(value)
        }
        return value
    }

    private static getKey(key, options: ObjectMapperOptions) {
        if(options && options.compareWithAttributesLowerCase) {
            return key.toLowerCase()
        }
        return key;
    }

    private static IsValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}