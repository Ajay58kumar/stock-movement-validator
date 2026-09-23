export default function Filters({
    filters,
    setFilters,
    warehouses
}) {

    return (

        <section className="card">

            <h2>
                2. Filters
            </h2>

            <div className="filters">

                {/* From */}

                <label>

                    From

                    <input
                        type="date"
                        value={filters.from}
                        onChange={(event) =>
                            setFilters({
                                ...filters,
                                from: event.target.value
                            })
                        }
                    />

                </label>

                {/* To */}

                <label>

                    To

                    <input
                        type="date"
                        value={filters.to}
                        onChange={(event) =>
                            setFilters({
                                ...filters,
                                to: event.target.value
                            })
                        }
                    />

                </label>

                {/* Movement type */}

                <label>

                    Movement Type

                    <select
                        value={filters.type}
                        onChange={(event) =>
                            setFilters({
                                ...filters,
                                type: event.target.value
                            })
                        }
                    >

                        <option value="ALL">
                            All
                        </option>

                        <option value="IN">
                            IN
                        </option>

                        <option value="OUT">
                            OUT
                        </option>

                    </select>

                </label>

                {/* Warehouse */}

                <label>

                    Warehouse

                    <select
                        value={filters.warehouse}
                        onChange={(event) =>
                            setFilters({
                                ...filters,
                                warehouse:
                                    event.target.value
                            })
                        }
                    >

                        <option value="ALL">
                            All
                        </option>

                        {warehouses.map(
                            warehouse => (

                                <option
                                    key={warehouse}
                                    value={warehouse}
                                >
                                    {warehouse}
                                </option>

                            )
                        )}

                    </select>

                </label>

            </div>

        </section>
    );
}