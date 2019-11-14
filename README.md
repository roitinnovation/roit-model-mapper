# ROIT model mapper
ROIT model mapper makes it easy to convert any object or JSON to the model

## Configure tsconfig

Add in file tsconfig.json attributes "experimentalDecorators" and "emitDecoratorMetadata"

```JSON
{
  "compilerOptions": {
    [...]
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    [...]
}
```

## Convert any object to model

```javascript

import { ModelMapper, JsonProperty } from "@roit/roit-model-mapper";

/**
 * Important: in the class all attributes must be initialized either with value or undefined, otherwise Mapper will not fill the attribute 
 */

// Models
export class Company {

    name: string = undefined

    identity: string = undefined

    @JsonProperty({ clazz: Address })
    address: Address = undefined
}

export class Address {

    country: string = undefined

    city: string = undefined

    @JsonProperty("street_address")
    streetAddress: string = undefined
}

let anyCompany = {
    name: "Company 1 SM inc",
    identity: "58.413.609/0001-72",
    address: {
        'street_address': 'R Argentina',
        city: 'Curitiba',
        country: 'Brasil'
    }
}

/**
 * ModelMapper
 * 1. Accept a simple object
 * 2. Accept array and return array
 * 3. Accept JSON string
*/

// Param 1: Model class, Param 2: any object, list or JSON string
const company = ModelMapper.deserialize(Company, anyCompany)

// Output
/**
  Company {
  name: 'Company 1 SM inc',
  identity: '58.413.609/0001-72',
  address:
   Address {
     country: 'Brasil',
     city: 'Curitiba',
     streetAddress: 'R Argentina' } }
 */
```

## Decorator JsonProperty

It has the purpose of informing some specific configuration for the attribute

```javascript
import { JsonProperty } from '@roit/roit-model-mapper';

// Mapper find in JSON or any object the property with name "street_address" and set value in "streetAddress"
@JsonProperty("street_address")
streetAddress: string = undefined

// Indicates the model class for Mapper initialize
@JsonProperty({ clazz: Address })
address: Address = undefined

// Finding attributes in class root for inicialize address
@JsonProperty({ linear: true })
address: Address = undefined

// Example

// Attributes linear
let anyCompany = {
    name: "Company 1 SM inc",
    identity: "58.413.609/0001-72",
    street_address: 'R Argentina',
    city: 'Curitiba',
    country: 'Brasil'
}

// Mark property linear
@JsonProperty({ linear: true })
address: Address = undefined

const company = ModelMapper.deserialize(Company, anyCompany)

// Output
/**
  Company {
  name: 'Company 1 SM inc',
  identity: '58.413.609/0001-72',
  address:
   Address {
     country: 'Brasil',
     city: 'Curitiba',
     streetAddress: 'R Argentina' } }
 */

```

## ObjectMapperOptions

Options for mapping the model

```javascript
import { ObjectMapperOptions } from '@roit/roit-model-mapper';

// SingleResult: return alwaeys a object
const company = ModelMapper.deserialize(Company, jsonObjectList, { singleResult: true })

// CompareWithAttributesLowerCase: compare attributes the JSON and Model in LowerCase
const company = ModelMapper.deserialize(Company, jsonObjectList, { compareWithAttributesLowerCase: true })

// NormalizeString: remove white spaces in strings
const company = ModelMapper.deserialize(Company, jsonObjectList, { normalizeString: true })

// IgnoreJsonPropertyName: ignore the name in @JsonProperty and uses name in class
const company = ModelMapper.deserialize(Company, jsonObjectList, { ignoreJsonPropertyName: true })

```

## Express integration

ModelMapper converts req.body to model using express middleware

```javascript
import { modelMapperMiddleware, ModelMapperRequest } from '@roit/roit-model-mapper';

// Step by Step

// Step 1: Import middleware controller and bodyParser.json()
var app = express();
app.use(bodyParser.json())
app.use(modelMapperMiddleware)

//  Step 2: Import ModelMapperRequest
app.post('mapper', function (req: ModelMapperRequest, res, next) {
  
  // Invoke bodyToObject method for mapping the object
  const company = req.mapper.bodyToObject(Company)

  console.log(company)

  res.send(company);
});

/**
 Company {
  name: 'Company 1 SM inc',
  identity: '58.413.609/0001-72',
  address:
   Address {
     country: 'Brasil',
     city: 'Curitiba',
     streetAddress: 'R Argentina' } }
*/
```