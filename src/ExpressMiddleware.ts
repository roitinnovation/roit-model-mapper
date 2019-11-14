import { ModelMapper } from "./ModelMapper";
import { Request, Response, NextFunction } from 'express'


export interface ModelMapperRequest extends Request {
    mapper: ModelMapper
}

export function modelMapperMiddleware (req: ModelMapperRequest, res: Response, next: NextFunction) {
    const map = new ModelMapper()
    map.setJsonObject(req.body)
    req.mapper = map
    next();
}