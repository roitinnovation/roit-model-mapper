import { expect } from 'chai';
import { ModelMapper } from "../src/"
import { Company } from "../src/models/Company"

import 'mocha';

describe('Model mapper tests', () => {

    it('Mapper jsonObject to Model Test', async () => {

        let anyCompany = {
            name: "Company 1 SM inc",
            identity: "58.413.609/0001-72",
            address: {
                'street_address': 'R Argentina',
                city: 'Curitiba',
                country: 'Brasil'
            }
        }

        const company = ModelMapper.deserialize(Company, anyCompany)

        console.log(company)

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.identity).to.equal("58.413.609/0001-72")
        expect(company.address).exist
        expect(company.address.streetAddress).to.equal("R Argentina")
        expect(company.address.city).to.equal("Curitiba")
        expect(company.address.country).to.equal("Brasil")
    });

    it('Mapper json string to Model Test', async () => {

        let anyCompany = {
            name: "Company 1 SM inc",
            identity: "58.413.609/0001-72",
            address: {
                'street_address': 'R Argentina',
                city: 'Curitiba',
                country: 'Brasil'
            }
        }

        const company = ModelMapper.deserialize(Company, JSON.stringify(anyCompany))

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.identity).to.equal("58.413.609/0001-72")
        expect(company.address).exist
        expect(company.address.streetAddress).to.equal("R Argentina")
        expect(company.address.city).to.equal("Curitiba")
        expect(company.address.country).to.equal("Brasil")
    });

    it('Mapper jsonObject List to Model Test', async () => {

        let anyCompanyList = [
            {
                name: "Company 1 SM inc",
                identity: "58.413.609/0001-72",
                address: {
                    'street_address': 'R Argentina',
                    city: 'Curitiba',
                    country: 'Brasil'
                }
            },

            {
                name: "Company 2 SM inc",
                identity: "58.413.609/0001-96",
                address: {
                    'street_address': 'R Paraguai',
                    city: 'Curitiba',
                    country: 'Brasil'
                }
            }
        ]

        const companyList = ModelMapper.deserialize(Company, anyCompanyList)

        expect(companyList).exist
        expect(companyList.length).to.equal(2)
        expect(companyList[0].name).to.equal("Company 1 SM inc")
        expect(companyList[1].name).to.equal("Company 2 SM inc")
        expect(companyList[0].address.streetAddress).to.equal("R Argentina")
        expect(companyList[1].address.streetAddress).to.equal("R Paraguai")
    });

    it('LowerCase options Test', async () => {

        let anyCompany = {
            NAME: "Company 1 SM inc",
            IDENTITY: "58.413.609/0001-72",
            address: {
                'street_address': 'R Argentina',
                city: 'Curitiba',
                country: 'Brasil'
            }
        }

        const company = ModelMapper.deserialize(Company, anyCompany, { compareWithAttributesLowerCase: true })

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.identity).to.equal("58.413.609/0001-72")

        const company2 = ModelMapper.deserialize(Company, anyCompany, { compareWithAttributesLowerCase: false })

        expect(company2).exist
        expect(company2.name).to.equal(undefined)
        expect(company2.identity).to.equal(undefined)
    });


    it('Single Result Test', async () => {

        let anyCompanyList = [
            {
                name: "Company 1 SM inc",
                identity: "58.413.609/0001-72",
                address: {
                    'street_address': 'R Argentina',
                    city: 'Curitiba',
                    country: 'Brasil'
                }
            },

            {
                name: "Company 2 SM inc",
                identity: "58.413.609/0001-96",
                address: {
                    'street_address': 'R Paraguai',
                    city: 'Curitiba',
                    country: 'Brasil'
                }
            }
        ]

        const company = ModelMapper.deserialize(Company, anyCompanyList, { singleResult: true })

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.identity).to.equal("58.413.609/0001-72")
    });


    it('Normalize String Test', async () => {

        let anyCompany = {
            name: "Company 1 SM inc",
            identity: "58.413.609/0001-72",
            address: {
                'street_address': 'R  Argentina',
                city: 'Curitiba',
                country: 'Brasil'
            }
        }

        const company = ModelMapper.deserialize(Company, anyCompany, { normalizeString: true })

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.address.streetAddress).to.equal("R Argentina")
    });

    it('Ignore JsonPropertyName Test', async () => {

        let anyCompany = {
            name: "Company 1 SM inc",
            identity: "58.413.609/0001-72",
            address: {
                streetAddress: 'R Argentina',
                city: 'Curitiba',
                country: 'Brasil'
            }
        }

        const company = ModelMapper.deserialize(Company, anyCompany, { ignoreJsonPropertyName: true })

        expect(company).exist
        expect(company.name).to.equal("Company 1 SM inc")
        expect(company.address.streetAddress).to.equal("R Argentina")

    });

});