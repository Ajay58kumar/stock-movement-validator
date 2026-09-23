import { useState } from "react";

import { sha256File } from "../utils/hash";

import { verifyFile } from "../services/api";

export default function FileUpload({
    onSuccess
}) {

    const [file, setFile] =
        useState(null);

    const [hash, setHash] =
        useState("");

    const [status, setStatus] =
        useState({
            type: "",
            message: ""
        });

    const [loading, setLoading] =
        useState(false);

    /*
     * File selection
     */
    const selectFile = async (event) => {

        const selected =
            event.target.files?.[0];

        setStatus({
            type: "",
            message: ""
        });

        setHash("");

        setFile(
            selected || null
        );

        if (!selected) {
            return;
        }

        try {

            const calculatedHash =
                await sha256File(
                    selected
                );

            setHash(
                calculatedHash
            );

        } catch (error) {

            setStatus({
                type: "error",
                message:
                    "Could not calculate SHA-256."
            });
        }
    };

    /*
     * Upload file
     */
    const upload = async () => {

        if (!file || !hash) {
            return;
        }

        setLoading(true);

        setStatus({
            type: "",
            message: ""
        });

        try {

            const result =
                await verifyFile(
                    file,
                    hash
                );

            setStatus({
                type: "success",
                message:
                    `SHA-256 verified. ${result.movements.length} records loaded.`
            });

            /*
             * Refresh table/charts
             */
            onSuccess();

        } catch (error) {

            const data =
                error.response?.data;

            setStatus({
                type: "error",
                message:
                    data?.message ||
                    "Upload failed."
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <section className="card">

            <h2>
                1. Verify & Upload JSON
            </h2>

            <p className="muted">

                Select a JSON file.
                The browser calculates
                SHA-256 before sending it
                to the backend.

            </p>

            <div className="upload-row">

                <input
                    type="file"
                    accept="application/json,.json"
                    onChange={selectFile}
                />

                <button
                    disabled={
                        !file ||
                        loading
                    }
                    onClick={upload}
                >

                    {loading
                        ? "Verifying..."
                        : "Verify & Upload"
                    }

                </button>

            </div>

            {file && (

                <div className="hash-box">

                    <strong>
                        File:
                    </strong>

                    {" "}

                    {file.name}

                    <br />

                    <strong>
                        SHA-256:
                    </strong>

                    {" "}

                    <span>
                        {hash}
                    </span>

                </div>

            )}

            {status.message && (

                <div
                    className={`status ${status.type}`}
                >
                    {status.message}
                </div>

            )}

        </section>
    );
}