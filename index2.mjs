import { PDFDocument } from "pdf-lib";
import fs from "fs";

// create output folder
if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

fs.readdir("./", (err, files) => {
  if (err) throw err;
  const filteredFiles = files
    .filter((file) => file.includes(".pdf") && !file.includes("output"))
    .filter((file) => file.match(/\d\d\.pdf/));
  console.log(filteredFiles);

  filteredFiles.map(process);
});

async function process(file) {
  // Load the input PDF file
  const pdfBytes1 = fs.readFileSync(file);
  const pdfBytes2 = fs.readFileSync(file.replace(/(\d\d)\.pdf/, "$1s.pdf"));
  // console.log(file.replace(/(\d\d)\.pdf/, "$1s.pdf"));

  // async function start() {
  const pdfDoc1 = await PDFDocument.load(pdfBytes1);

  // Get the first page of the PDF
  const page1 = pdfDoc1.getPages()[0];

  // Draw the overlay page on top of the input page
  const [embed] = await pdfDoc1.embedPdf(pdfBytes2);
  page1.drawPage(embed, {
    x: 400,
    y: 30,
  });

  // Write the output PDF to disk
  fs.writeFileSync(`./output/${file}.pdf`, await pdfDoc1.save());
  console.log(`done successfully! - ${file}`);
}
