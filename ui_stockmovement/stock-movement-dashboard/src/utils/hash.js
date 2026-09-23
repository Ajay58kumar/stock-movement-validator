export async function sha256File(file) {

    // Read file as bytes
    const buffer = await file.arrayBuffer();

    // Calculate SHA-256
    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            buffer
        );

    // Convert bytes to hexadecimal
    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(byte =>
            byte
                .toString(16)
                .padStart(2, "0")
        )
        .join("");
}