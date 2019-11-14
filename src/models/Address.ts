import { JsonProperty } from "../JsonProperty";

export class Address {

    country: string = undefined

    city: string = undefined

    @JsonProperty("street_address")
    streetAddress: string = undefined
}