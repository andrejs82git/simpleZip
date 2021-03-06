const mocha = require('mocha');
const chai = require('chai');
const fs = require('fs');
const JSZip = require("jszip");

const expect = chai.expect;

describe('Test zip file', () => {
    const simpleZipArchve = require("../index");

    it('Simple one file', async () => {
        const zipUInt8BufferActual = simpleZipArchve(
            [{ name: "test1.txt", text: 'Hello', datetime: new Date('2020-08-27 13:47:21 +0300') }]
        );

        const zip = await JSZip.loadAsync(zipUInt8BufferActual);
        const contentFromZip = await zip.file('test1.txt').async("string");

        expect(contentFromZip).to.equals('Hello');
    });

    it('Simple tree files', async () => {
        const zipUInt8BufferActual = simpleZipArchve([
            { name: "test1.txt", text: 'Hello', datetime: new Date('2020-08-27 13:47:21 +0300') },
            { name: "test2.txt", text: 'Hello2', datetime: new Date('2020-08-28 14:48:22 +0300') },
            { name: "test3.txt", text: 'Привет3', datetime: new Date('2020-08-28 14:48:22 +0300') }
        ]);
        
        
        const zip = await JSZip.loadAsync(zipUInt8BufferActual);
        const contentFromZip1 = await zip.file('test1.txt').async("string");
        const contentFromZip2 = await zip.file('test2.txt').async("string");
        const contentFromZip3 = await zip.file('test3.txt').async("string");

        expect(contentFromZip1).to.equals('Hello');
        expect(contentFromZip2).to.equals('Hello2');
        expect(contentFromZip3).to.equals('Привет3');
    });

    // it('Simple test', async () => {
    //     const zipUInt8BufferActual = simpleZipArchve(
    //         [{ name: "test1.txt", text: 'Hello', datetime: new Date('2020-08-27 13:47:21 +0300') }]
    //     );
    //     const zipFromTemplateFile1Expected = Uint8Array.from(fs.readFileSync('./test/test1.zip'));

    //     fs.writeFileSync("result1.zip", zipUInt8BufferActual);
    //     expect(zipUInt8BufferActual).to.deep.equals(zipFromTemplateFile1Expected);
    // });

});