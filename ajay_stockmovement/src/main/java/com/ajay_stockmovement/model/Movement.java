package com.ajay_stockmovement.model;

import java.time.Instant;

public class Movement {

    private String id;

    private Instant timestamp;

    private String sku;

    private MovementType movementType;

    private int quantity;

    private String warehouse;

    public Movement() {
    }

    public Movement(
            String id,
            Instant timestamp,
            String sku,
            MovementType movementType,
            int quantity,
            String warehouse
    ) {
        this.id = id;
        this.timestamp = timestamp;
        this.sku = sku;
        this.movementType = movementType;
        this.quantity = quantity;
        this.warehouse = warehouse;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public MovementType getMovementType() {
        return movementType;
    }

    public void setMovementType(MovementType movementType) {
        this.movementType = movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getWarehouse() {
        return warehouse;
    }

    public void setWarehouse(String warehouse) {
        this.warehouse = warehouse;
    }
}
