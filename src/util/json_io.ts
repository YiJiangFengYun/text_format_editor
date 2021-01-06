import * as fs from "fs";

export class JsonIO {
    public static readFile(filePath: string, encoding: BufferEncoding) {
        return new Promise<string>((fulfill, reject) => {
            try {
                let res = fs.readFileSync(filePath, { encoding });
                fulfill(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    public static writeFile(filePath:string, data: any, encoding: BufferEncoding) {
        return new Promise<void>((resolve, reject) => {
            try {
                fs.writeFileSync(
                    filePath, 
                    data, 
                    {
                        encoding: encoding,
                    }
                );
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    public static readJSON(filePath: string) {
        return JsonIO.readFile(filePath, "utf8").then(JSON.parse);
    }

    public static writeJSON(filePath: string, data: any) {
        if (typeof data === "string") {
            return JsonIO.writeFile(filePath, data, "utf8");
        } else {
            return JsonIO.writeFile(filePath, JSON.stringify(data), "utf8");
        }
    }
}
