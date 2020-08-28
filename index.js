const simpleZipArchve = (fileDataArray) => {
  const CRCTable = (() => {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  })();

  var crc32 = function (bin) {
    var crc = 0 ^ (-1);

    for (var i = 0; i < bin.length; i++) {
      crc = (crc >>> 8) ^ CRCTable[(crc ^ bin[i]) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
  };



  const getFileHeader = (fileData) => {
    return Uint8Array.from([
      ...getFileHeaderSignature(),
      ...getFileHeaderVersion(),
      ...getFileHeaderGeneralPurposeBitFlag(),
      ...getFileHeaderCompressionMethod(),
      ...getFileTime(fileData.datetime),
      ...getFileDate(fileData.datetime),
      ...getCrc(fileData),
      ...getCompressSize(fileData),
      ...getUnCompressSize(fileData),
      ...getFileNameLength(fileData),
      ...getExtraFieldLength(),
      ...getFileName(fileData),
    ]);
  }
  /**
   * Source from https://en.wikipedia.org/wiki/Zip_(file_format) and https://blog2k.ru/archives/3391
   */

  const getFileHeaderSignature = () => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, 0x04034b50, true);
    return new Uint8Array(buf);
  }

  const getFileHeaderVersion = () => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, 0x000a, true);
    return new Uint8Array(buf);
  }

  const getFileHeaderGeneralPurposeBitFlag = () => {
    return new Uint8Array(2);
  }

  const getFileHeaderCompressionMethod = () => {
    return new Uint8Array(2);
  }


  const getCrc = (fileData) => {
    const crc = crc32(fileData.data);
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, crc, true);
    return new Uint8Array(buf);
  }

  const getCompressSize = (fileData) => {
    return getUnCompressSize(fileData);
  }


  const getUnCompressSize = (fileData) => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, fileData.data.length, true);
    return new Uint8Array(buf);
  }

  const getFileNameLength = (fileData) => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, getFileName(fileData).length, true);
    return new Uint8Array(buf);
  }

  const getExtraFieldLength = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getFileName = (fileData) => {
    return fileData.fileNameData;
  }

  const getFileData = (fileData) => {
    return fileData.data;
  }

  ////////////////////////////////////////////
  //...getCentralDirectory(txtFiles)
  ////////////////////////////////////////////
  const getCentralDirectory = (fileData, offsetFromStartFile) => {
    // return Uint8Array.from([...new Uint8Array(new ArrayBuffer(42+4)), ...getFileName(f1)]);
    return Uint8Array.from(
      [
        ...getCentralDirectory_Signature(),
        ...getCentralDirectory_VersionMadeBy(),
        ...getCentralDirectory_VersionToExtract(),
        ...getCentralDirectory_GeneralPurposeBitFlag(),
        ...getCentralDirectory_CompressionMethod(),
        ...getFileTime(fileData.datetime),
        ...getFileDate(fileData.datetime),
        ...getCrc(fileData),
        ...getCompressSize(fileData),
        ...getUnCompressSize(fileData),
        ...getFileNameLength(fileData),
        ...getExtraFieldLength(),
        ...getCentralDirectory_FileCommentLength(),
        ...getCentralDirectory_FileDiskNumberStart(),
        ...getCentralDirectory_FileInternalAttributes(),
        ...getCentralDirectory_FileExternalAttributes(),
        ...getCentralDirectory_RelativeOffsetOfLocalFileHeader(offsetFromStartFile),
        ...getFileName(fileData),
      ]
    );
  }

  const getCentralDirectory_Signature = () => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, 0x02014b50, true);
    return new Uint8Array(buf);
  }


  const getCentralDirectory_VersionMadeBy = () => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, 63, true);
    return new Uint8Array(buf);
  }


  const getCentralDirectory_VersionToExtract = () => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, 10, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_GeneralPurposeBitFlag = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_CompressionMethod = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_FileCommentLength = (fileData) => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_FileDiskNumberStart = (fileData) => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_FileInternalAttributes = (fileData) => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, 32, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_FileExternalAttributes = (fileData) => {
    const buf = new ArrayBuffer(4);
    return new Uint8Array(buf);
  }

  const getCentralDirectory_RelativeOffsetOfLocalFileHeader = (offsetFromStartFile) => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, offsetFromStartFile, true);
    return new Uint8Array(buf);
  }

  ////////////////////////////////////////////
  //...getCentralDirectoryEOCD() / END
  ////////////////////////////////////////////
  const getCentralDirectoryEOCD = (txtFiles) => {
    return Uint8Array.from(
      [
        ...getCentralDirectoryEOCD_Signature(),
        ...getCentralDirectoryEOCD_NumberOfDisk(),
        ...getCentralDirectoryEOCD_DiskWhereCentralDirectoryStarts(),
        ...getCentralDirectoryEOCD_NumberOfCentralDirectoryRecords(txtFiles),
        ...getCentralDirectoryEOCD_TotalNumberOfCentralDirectoryRecords(txtFiles),
        ...getCentralDirectoryEOCD_SizeOfCentralDirectory(txtFiles),
        ...getCentralDirectoryEOCD_OffsetFromStartArchiveToCentralDirectory(txtFiles),
        ...getCentralDirectoryEOCD_getComment()
      ]
    );
  }

  const getCentralDirectoryEOCD_Signature = () => {
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, 0x06054b50, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_NumberOfDisk = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_DiskWhereCentralDirectoryStarts = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_NumberOfCentralDirectoryRecords = (fileList) => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }


  const getCentralDirectoryEOCD_TotalNumberOfCentralDirectoryRecords = (fileList) => {
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, fileList.length, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_SizeOfCentralDirectory = (fileList) => {
    const buf = new ArrayBuffer(4);
    const size = fileList.reduce((acc, fileData) => acc + fileData.centralDirectoryData.length, 0);
    new DataView(buf).setUint32(0, size, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_OffsetFromStartArchiveToCentralDirectory = (fileList) => {
    const buf = new ArrayBuffer(4);
    const size = fileList.reduce((acc, fileData) => acc + fileData.fileHeaderData.length + fileData.data.length, 0);
    new DataView(buf).setUint32(0, size, true);
    return new Uint8Array(buf);
  }

  const getCentralDirectoryEOCD_getComment = () => {
    const buf = new ArrayBuffer(2);
    return new Uint8Array(buf);
  }


  /**
   * Format getet from here 
   * https://docs.microsoft.com/ru-ru/windows/win32/api/winbase/nf-winbase-dosdatetimetofiletime?redirectedfrom=MSDN
   */
  const getFileTime = (datetime) => {
    const seconds = `00000${Math.ceil(datetime.getSeconds() / 2).toString(2)}`.substr(-5);
    const minutes = `000000${(datetime.getMinutes() - 0).toString(2)}`.substr(-6);
    const hours = `00000${(datetime.getHours() - 0).toString(2)}`.substr(-5);
    const fullTime = `${hours}${minutes}${seconds}`;
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, parseInt(fullTime, 2), true);
    return new Uint8Array(buf);
  }

  const getFileDate = (datetime) => {
    const day = `00000${(datetime.getDate()).toString(2)}`.substr(-5);
    const month = `0000${(datetime.getMonth() + 1).toString(2)}`.substr(-4);
    const year = `0000000${(datetime.getYear() - 80).toString(2)}`.substr(-7);
    const fullTime = `${year}${month}${day}`;
    const buf = new ArrayBuffer(2);
    new DataView(buf).setUint16(0, parseInt(fullTime, 2), true);
    return new Uint8Array(buf);
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  let lastSize = 0;
  fileDataArray.forEach((fileData) => {
    fileData.data = new TextEncoder('utf-8').encode(fileData.text)
    fileData.fileNameData = new TextEncoder('ascii').encode(fileData.name);
    fileData.datetime = fileData.datetime || new Date();
    fileData.fileHeaderData = [...getFileHeader(fileData)];
    fileData.centralDirectoryData = [...getCentralDirectory(fileData, lastSize)]
    lastSize = lastSize + fileData.fileHeaderData.length + fileData.data.length;
  })

  const fileHeadersAndDatas = fileDataArray.reduce((acc, f) => {
    return [...acc, ...f.fileHeaderData, ...f.data]
  }, []);

  const fileCentralDirectory = fileDataArray.reduce((acc, f) => {
    return [...acc, ...f.centralDirectoryData]
  }, []);


  return Uint8Array.from([
    ...fileHeadersAndDatas,
    ...fileCentralDirectory,
    ...getCentralDirectoryEOCD(fileDataArray)
  ]);
};

module.exports = simpleZipArchve;