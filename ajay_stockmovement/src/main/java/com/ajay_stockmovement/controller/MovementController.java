package com.ajay_stockmovement.controller;

import com.ajay_stockmovement.model.Movement;
import com.ajay_stockmovement.model.MovementType;
import com.ajay_stockmovement.service.MovementService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MovementController {

    private final MovementService movementService;

    public MovementController(
            MovementService movementService
    ) {
        this.movementService = movementService;
    }

    @GetMapping("/movements")
    public List<Movement> getMovements(

            @RequestParam LocalDate from,

            @RequestParam LocalDate to,

            @RequestParam(
                    required = false
            )
            MovementType type,

            @RequestParam(
                    required = false
            )
            String warehouse

    ) throws Exception {

        if (from.isAfter(to)) {

            throw new IllegalArgumentException(
                    "from date cannot be after to date"
            );
        }

        return movementService.getMovements(
                from,
                to,
                type,
                warehouse
        );
    }

    /*
     * POST /api/verify-file
     */
    @PostMapping(
            value = "/verify-file",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> verifyFile(

            @RequestPart("file")
            MultipartFile file,

            @RequestPart("sha256")
            String sha256

    ) throws Exception {

        MovementService.VerifyResult result =
                movementService.verifyAndPersist(
                        file,
                        sha256
                );

        /*
         * Invalid SHA.
         */
        if (!result.valid()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "valid", false,
                                    "message",
                                    "SHA-256 hash mismatch",
                                    "expectedHash",
                                    result.expectedHash(),
                                    "actualHash",
                                    result.actualHash()
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid", true,
                        "message",
                        "File verified and stored successfully",
                        "sha256",
                        result.actualHash(),
                        "movements",
                        result.movements()
                )
        );
    }

    @ExceptionHandler(
            IllegalArgumentException.class
    )
    public ResponseEntity<Map<String, String>>
    handleBadRequest(
            IllegalArgumentException e
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage()
                        )
                );
    }
}