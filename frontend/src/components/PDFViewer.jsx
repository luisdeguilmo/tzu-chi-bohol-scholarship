import { Document, Page } from "react-pdf";

export default function PDFViewer({ file }) {
    return (
        <Document file={file}>
            <Page pageNumber={1} />
        </Document>
    );
}
