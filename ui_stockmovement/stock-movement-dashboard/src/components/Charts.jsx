import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

export default function Charts({
    movements
}) {


    const inTotal =
        movements
            .filter(
                movement =>
                    movement.movementType === "IN"
            )
            .reduce(
                (sum, movement) =>
                    sum + movement.quantity,
                0
            );

    const outTotal =
        movements
            .filter(
                movement =>
                    movement.movementType === "OUT"
            )
            .reduce(
                (sum, movement) =>
                    sum + movement.quantity,
                0
            );


    const pieData = [
        {
            name: "IN",
            value: inTotal
        },
        {
            name: "OUT",
            value: outTotal
        }
    ].filter(
        item => item.value > 0
    );

    const dailyData =
        Object.values(
            movements.reduce(
                (result, movement) => {

                    const date =
                        movement.timestamp
                            .slice(0, 10);

                    if (!result[date]) {

                        result[date] = {
                            date,
                            IN: 0,
                            OUT: 0
                        };
                    }

                    result[date][
                        movement.movementType
                    ] += movement.quantity;

                    return result;

                },
                {}
            )
        ).sort(
            (a, b) =>
                a.date.localeCompare(
                    b.date
                )
        );

    return (

        <div className="charts-grid">

            {/* Pie Chart */}

            <section className="card chart-card">

                <h2>
                    4. IN vs OUT Quantity
                </h2>

                <div className="chart">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <PieChart>

                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius="70%"
                                label
                            >

                                {pieData.map(
                                    (entry, index) => (

                                        <Cell
                                            key={
                                                entry.name
                                            }
                                            fill={
                                                index === 0
                                                    ? "#2563eb"
                                                    : "#f97316"
                                            }
                                        />

                                    )
                                )}

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </section>

            {/* Time Series */}

            <section className="card chart-card">

                <h2>
                    5. Daily Movement
                </h2>

                <div className="chart">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <LineChart
                            data={dailyData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="date"
                            />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Line
                                type="monotone"
                                dataKey="IN"
                                stroke="#2563eb"
                                strokeWidth={2}
                            />

                            <Line
                                type="monotone"
                                dataKey="OUT"
                                stroke="#f97316"
                                strokeWidth={2}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </section>

        </div>
    );
}