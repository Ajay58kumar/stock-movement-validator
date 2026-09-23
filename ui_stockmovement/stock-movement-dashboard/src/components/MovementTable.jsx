import {
    useEffect,
    useState
} from "react";

export default function MovementTable({
    movements
}) {

    const [page, setPage] =
        useState(1);

    const pageSize = 10;

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                movements.length /
                pageSize
            )
        );

    const safePage =
        Math.min(
            page,
            totalPages
        );

    const startIndex =
        (safePage - 1) *
        pageSize;

    const rows =
        movements.slice(
            startIndex,
            startIndex + pageSize
        );

    /*
     * Reset page if filtering
     * reduces number of pages.
     */
    useEffect(() => {

        if (page !== safePage) {
            setPage(safePage);
        }

    }, [page, safePage]);

    return (

        <section className="card">

            <div className="section-title">

                <h2>
                    3. Stock Movements
                </h2>

                <span>
                    {movements.length} records
                </span>

            </div>

            <div className="table-wrap">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Date/Time
                            </th>

                            <th>
                                SKU
                            </th>

                            <th>
                                Movement Type
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Warehouse
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {rows.length > 0 ? (

                            rows.map(movement => (

                                <tr
                                    key={
                                        movement.id
                                    }
                                >

                                    <td>
                                        {new Date(
                                            movement.timestamp
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        {movement.sku}
                                    </td>

                                    <td>

                                        <span
                                            className={`badge ${movement.movementType.toLowerCase()}`}
                                        >
                                            {
                                                movement.movementType
                                            }
                                        </span>

                                    </td>

                                    <td>
                                        {movement.quantity}
                                    </td>

                                    <td>
                                        {
                                            movement.warehouse ||
                                            "-"
                                        }
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="5"
                                    className="empty"
                                >
                                    No movements match
                                    the filters.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            <div className="pagination">

                <button
                    disabled={
                        safePage === 1
                    }
                    onClick={() =>
                        setPage(
                            previous =>
                                previous - 1
                        )
                    }
                >
                    Previous
                </button>

                <span>
                    Page {safePage} of {totalPages}
                </span>

                <button
                    disabled={
                        safePage === totalPages
                    }
                    onClick={() =>
                        setPage(
                            previous =>
                                previous + 1
                        )
                    }
                >
                    Next
                </button>

            </div>

        </section>
    );
}