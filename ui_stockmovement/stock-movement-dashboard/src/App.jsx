import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    fetchMovements
} from "./services/api";

import FileUpload from "./components/FileUpload";

import Filters from "./components/Filters";

import MovementTable from "./components/MovementTable";

import Charts from "./components/Charts";


const initialFilters = {

    from: "2026-03-01",

    to: "2026-03-31",

    type: "ALL",

    warehouse: "ALL"

};


export default function App() {

    const [
        filters,
        setFilters
    ] = useState(
        initialFilters
    );

    const [
        movements,
        setMovements
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    /*
     * Load movements from backend.
     */
    const loadMovements = async () => {

        if (
            !filters.from ||
            !filters.to
        ) {
            return;
        }

        if (
            filters.from >
            filters.to
        ) {
            setError(
                "From date cannot be after To date."
            );

            return;
        }

        setLoading(true);

        setError("");

        try {

            const data =
                await fetchMovements(
                    filters
                );

            setMovements(data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Could not load movements. Is the backend running?"
            );

        } finally {

            setLoading(false);
        }
    };


    /*
     * Reload whenever filters change.
     */
    useEffect(() => {

        loadMovements();

    }, [
        filters.from,
        filters.to,
        filters.type,
        filters.warehouse
    ]);


    /*
     * Warehouse dropdown values.
     */
    const warehouses =
        useMemo(
            () =>
                [
                    ...new Set(
                        movements
                            .map(
                                movement =>
                                    movement.warehouse
                            )
                            .filter(Boolean)
                    )
                ].sort(),
            [movements]
        );


    return (

        <main className="container">

            {/* Header */}

            <header>

                <div>

                    <p className="eyebrow">
                        FULL-STACK DEMO
                    </p>

                    <h1>
                        Stock Movement Validator
                    </h1>

                    <p className="subtitle">

                        SHA-256 verified JSON
                        →
                        Spring Boot
                        →
                        React dashboard

                    </p>

                </div>

                <div className="api-status">

                    API :8080

                </div>

            </header>


            {/* Upload */}

            <FileUpload
                onSuccess={
                    loadMovements
                }
            />


            {/* Filters */}

            <Filters
                filters={filters}
                setFilters={setFilters}
                warehouses={warehouses}
            />


            {/* Error */}

            {error && (

                <div className="status error">

                    {error}

                </div>

            )}


            {/* Content */}

            {loading ? (

                <div className="loading">

                    Loading filtered
                    movements...

                </div>

            ) : (

                <>

                    <MovementTable
                        movements={movements}
                    />

                    <Charts
                        movements={movements}
                    />

                </>

            )}

        </main>
    );
}