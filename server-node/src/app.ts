import express from "express";
import fs from "fs";
import path from "path";
import { bundleMDX } from 'mdx-bundler'
import cors from 'cors'

export const app = express();

app.use(cors())

export const getFiles = (dir: string): string[] => {
    const fileDirectory = path.join(process.cwd(), dir)

    if (!fs.existsSync(fileDirectory)) {
        throw new Error('You are using the empty directory')
    }

    const readFolderDirectory = fs.readdirSync(fileDirectory)

    return readFolderDirectory.map((file) => file.replace(/\.mdx/, ''))
}

const getFileByName = (dir: string, fileName: string): string => {
    const sourceFile = path.join(process.cwd(), dir, fileName)

    if (!fs.existsSync(sourceFile)) {
        throw new Error('File cannot be found')
    }

    const readFileDirectory = fs.readFileSync(sourceFile, 'utf8')

    return readFileDirectory
}

//Initialize Request Data Type
app.use(express.json({ limit: "100mb" }));

app.get("/", (req, res) => res.send("Hello World!!"));

app.get('/path', async function (req, res) {
    const files = getFiles('markdown')
    
    res.json({
        files,
    });
  });

app.get('/content/:name', async function (req, res) {
    const mdxSource = getFileByName('markdown', `${req.params.name}.mdx`)
    const { code, frontmatter } = await bundleMDX({
        source: mdxSource,
      })
    
    res.json({
        code,
        frontmatter
    });
  });

app.get('/contents', async function (req, res) {
    const files = getFiles("markdown")

    const contents = await Promise.all(
        files.map(async (fileName) => {
            const mdxSource = getFileByName("markdown", `${fileName}.mdx`)
            const {  frontmatter } = await bundleMDX({
                source: mdxSource,
                })

            return {
                slug: fileName,
                ...frontmatter
            }
        })
    )

    res.json({
        contents
    });
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is live on ${port}`);
});