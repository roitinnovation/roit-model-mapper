import { ModelMapper } from "./ModelMapper";
import { Request, NextFunction } from 'express'


export interface ModelMapperRequest extends Request {
    mapper: ModelMapper
}

export function modelMapperMiddleware (req: ModelMapperRequest, {}, next: NextFunction) {
    const map = new ModelMapper()
    map.setJsonObject(req.body)
    req.mapper = map
    next();
}