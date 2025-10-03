import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';

function saveBinaryFile(fileName, content) {
  writeFile(fileName, content, (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KE,
  });

  const model = 'gemini-2.5-flash-image-preview';
  const contents = [
    {
      role: 'user',
      parts: [
        { text: `INSERT_INPUT_HERE` },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
    contents,
  });

  let fileIndex = 0;

  for await (const chunk of response) {
    const parts = chunk.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        const fileName = `output_image_${fileIndex++}`;
        const fileExtension = mime.getExtension(part.inlineData.mimeType || 'png');
        const buffer = Buffer.from(part.inlineData.data || '', 'base64');
        saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
      } else if (part.text) {
        console.log(part.text);
      }
    }
  }
}

main().catch(console.error);
