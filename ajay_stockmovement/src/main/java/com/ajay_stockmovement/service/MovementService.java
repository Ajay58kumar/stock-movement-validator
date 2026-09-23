package com.ajay_stockmovement.service;

import com.ajay_stockmovement.model.Movement;
import com.ajay_stockmovement.model.MovementType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HexFormat;
import java.util.List;

@Service
public class MovementService {

    private static final String DEFAULT_RESOURCE =
            "data/movements.json";

    private final ObjectMapper objectMapper;

    /*
     * Runtime file.
     *
     * The original sample JSON is copied here when the
     * application starts for the first time.
     */
    private final Path storagePath;

    public MovementService(ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        this.storagePath = Path.of(
                "data",
                "movements.json"
        ).toAbsolutePath();

        initializeStorage();
    }
    public List<Movement> getMovements(
            LocalDate from,
            LocalDate to,
            MovementType type,
            String warehouse
    ) throws IOException {

        List<Movement> movements = readMovements();

        return movements.stream()

                // From date
                .filter(m ->
                        !m.getTimestamp()
                                .atZone(ZoneOffset.UTC)
                                .toLocalDate()
                                .isBefore(from)
                )

                // To date
                .filter(m ->
                        !m.getTimestamp()
                                .atZone(ZoneOffset.UTC)
                                .toLocalDate()
                                .isAfter(to)
                )

                // IN / OUT
                .filter(m ->
                        type == null ||
                                m.getMovementType() == type
                )

                // Warehouse
                .filter(m ->
                        warehouse == null ||
                                warehouse.isBlank() ||
                                warehouse.equalsIgnoreCase(
                                        m.getWarehouse()
                                )
                )

                .toList();
    }

    public VerifyResult verifyAndPersist(
            MultipartFile file,
            String expectedHash
    ) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "JSON file is required"
            );
        }

        if (expectedHash == null ||
                expectedHash.isBlank()) {

            throw new IllegalArgumentException(
                    "SHA-256 digest is required"
            );
        }


        byte[] bytes = file.getBytes();

        String actualHash = sha256(bytes);

        boolean valid =
                actualHash.equalsIgnoreCase(
                        expectedHash.trim()
                );


        if (!valid) {

            return new VerifyResult(
                    false,
                    expectedHash.trim(),
                    actualHash,
                    List.of()
            );
        }

        List<Movement> parsed =
                objectMapper.readValue(
                        bytes,
                        new TypeReference<List<Movement>>() {}
                );

        validate(parsed);


        Files.createDirectories(
                storagePath.getParent()
        );

        Files.copy(
                file.getInputStream(),
                storagePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return new VerifyResult(
                true,
                expectedHash.trim(),
                actualHash,
                parsed
        );
    }

    public List<Movement> readMovements()
            throws IOException {

        if (!Files.exists(storagePath)) {
            initializeStorage();
        }

        byte[] bytes =
                Files.readAllBytes(storagePath);

        return objectMapper.readValue(
                bytes,
                new TypeReference<List<Movement>>() {}
        );
    }

    private void validate(
            List<Movement> movements
    ) {

        if (movements == null) {

            throw new IllegalArgumentException(
                    "JSON must contain an array of movements"
            );
        }

        for (Movement movement : movements) {

            if (movement.getId() == null ||
                    movement.getTimestamp() == null ||
                    movement.getSku() == null ||
                    movement.getMovementType() == null) {

                throw new IllegalArgumentException(
                        "Each movement needs id, timestamp, sku and movementType"
                );
            }

            if (movement.getQuantity() < 0) {

                throw new IllegalArgumentException(
                        "Quantity cannot be negative"
                );
            }
        }
    }

    private String sha256(byte[] bytes)
            throws Exception {

        byte[] digest =
                MessageDigest
                        .getInstance("SHA-256")
                        .digest(bytes);

        return HexFormat
                .of()
                .formatHex(digest);
    }

    private void initializeStorage() {

        try {

            Files.createDirectories(
                    storagePath.getParent()
            );

            if (!Files.exists(storagePath)) {

                try (InputStream input =
                             new ClassPathResource(
                                     DEFAULT_RESOURCE
                             ).getInputStream()) {

                    Files.copy(
                            input,
                            storagePath,
                            StandardCopyOption.REPLACE_EXISTING
                    );
                }
            }

        } catch (IOException e) {

            throw new IllegalStateException(
                    "Could not initialize movement data",
                    e
            );
        }
    }

    public record VerifyResult(
            boolean valid,
            String expectedHash,
            String actualHash,
            List<Movement> movements
    ) {
    }
}
