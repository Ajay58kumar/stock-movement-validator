import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

/*
 * GET /api/movements
 */
export const fetchMovements = async ({
    from,
    to,
    type,
    warehouse
}) => {

    const params = {
        from,
        to
    };

    if (type !== "ALL") {
        params.type = type;
    }

    if (warehouse !== "ALL") {
        params.warehouse = warehouse;
    }

    const response =
        await api.get(
            "/movements",
            { params }
        );

    return response.data;
};

/*
 * POST /api/verify-file
 */
export const verifyFile = async (
    file,
    sha256
) => {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "sha256",
        sha256
    );

    const response =
        await api.post(
            "/verify-file",
            formData
        );

    return response.data;
};