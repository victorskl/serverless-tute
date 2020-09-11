import { Storage } from "aws-amplify";

/**
 * Upload a File to S3
 * https://serverless-stack.com/chapters/upload-a-file-to-s3.html
 *
 * We will be uploading files when a note is created and when a note is edited.
 * So let's create a simple convenience method to help with that.
 *
 * The method does a couple of things.
 * 1. It takes a file object as a parameter.
 * 2. Generates a unique file name using the current timestamp (Date.now()). Of course, if your app is being used heavily this might not be the best way to create a unique filename. But this should be fine for now.
 * 3. Upload the file to the user’s folder in S3 using the Storage.vault.put() object. Alternatively, if we were uploading publicly you can use the Storage.put() method.
 * 4. And return the stored object’s key.
 *
 * @param file
 * @returns {Promise<*>}
 */
export async function s3Upload(file) {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });

    return stored.key;
}
