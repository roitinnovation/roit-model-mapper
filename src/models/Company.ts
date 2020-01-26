import { Address } from "./Address";
import { JsonProperty } from "..";

export class Company {

    name: string = undefined

    identity: string = undefined

    @JsonProperty({ clazz: Address })
    address: Address = undefined

    @JsonProperty({ clazz: Address, alwaysArray: true })
    address2: Array<Address> = undefined

    @JsonProperty({ clazz: Address, alwaysArray: true })
    address3: Array<Address> = undefined

    @JsonProperty({ clazz: Address, alwaysArray: true })
    address4: Array<Address> = undefined
}