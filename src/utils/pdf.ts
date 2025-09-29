import pdfToText from 'react-pdftotext'

export const extractPDFContents = async (file: File) => {
    const text = await pdfToText(file);
    return text;
}