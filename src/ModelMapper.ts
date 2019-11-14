import { ObjectMapperOptions } from "./ObjectMapperOptions";
import { MapperHandle } from "./MapperHandle";

export class ModelMapper {

    private jsonObject: any

    private optionsMapper: ObjectMapperOptions

    setJsonObject(jsonObject: any) {
        this.jsonObject = jsonObject
    }

    bodyToObject<T>(clazz: { new(): T }, optionsMapper?: ObjectMapperOptions) {
        return MapperHandle.deserialize(clazz, this.jsonObject, optionsMapper ? optionsMapper : this.optionsMapper)
    }

    static deserialize<T>(clazz: { new(): T }, jsonObject: any, optionsMapper?: ObjectMapperOptions) {
        return MapperHandle.deserialize(clazz, jsonObject, optionsMapper)
    }
}