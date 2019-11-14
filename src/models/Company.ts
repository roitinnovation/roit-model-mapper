import { Address } from "./Address";
import { JsonProperty } from "..";

export class Company {

    name: string = undefined

    identity: string = undefined

    @JsonProperty({ clazz: Address })
    address: Address = undefined
}