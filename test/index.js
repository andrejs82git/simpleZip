const mocha = require('mocha');
const chai = require('chai');
const fs = require('fs');

const expect = chai.expect;

describe('Test zip file', () => {
    const simpleZipArchve = require("../index");
    it('Simple test', async () => {
        const zipUInt8BufferActual = simpleZipArchve(
            [{name: "test1.txt", text: 'Hello', datetime: new Date('2020-08-27 13:47:21 +0300')}]
        );
        const zipFromTemplateFile1Expected = Uint8Array.from(fs.readFileSync('./test/test1.zip'));

        fs.writeFileSync("result1.zip", zipUInt8BufferActual);

        expect(zipUInt8BufferActual).to.deep.equals(zipFromTemplateFile1Expected);


    });

    it('Simple test 2', async () => {
        const zipUInt8BufferActual = simpleZipArchve([
           { name: "test1.txt", text: 'Hello', datetime: new Date('2020-08-27 13:47:21 +0300')},
            {name: "test2.txt", text: 'Hello2', datetime: new Date('2020-08-28 14:48:22 +0300')}
        ]);
        fs.writeFileSync("result2.zip", zipUInt8BufferActual);
    });

});