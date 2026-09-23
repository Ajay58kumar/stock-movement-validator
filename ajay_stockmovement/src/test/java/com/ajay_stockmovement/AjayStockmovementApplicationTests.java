package com.ajay_stockmovement;

import com.ajay_stockmovement.service.MovementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

import static org.junit.jupiter.api.Assertions.*;

class MovementServiceTest {

	@Test
	void verifiesValidSha256() throws Exception {

		MovementService service =
				new MovementService(
						new ObjectMapper()
								.findAndRegisterModules()
				);

		byte[] json =
				"""
                [
                  {
                    "id": "1",
                    "timestamp": "2026-03-10T10:00:00Z",
                    "sku": "SKU1",
                    "movementType": "IN",
                    "quantity": 5
                  }
                ]
                """
						.getBytes(StandardCharsets.UTF_8);

		String hash =
				HexFormat
						.of()
						.formatHex(
								MessageDigest
										.getInstance("SHA-256")
										.digest(json)
						);

		MockMultipartFile file =
				new MockMultipartFile(
						"file",
						"movements.json",
						"application/json",
						json
				);

		MovementService.VerifyResult result =
				service.verifyAndPersist(
						file,
						hash
				);

		assertTrue(result.valid());

		assertEquals(
				1,
				result.movements().size()
		);
	}

	@Test
	void rejectsInvalidSha256() throws Exception {

		MovementService service =
				new MovementService(
						new ObjectMapper()
								.findAndRegisterModules()
				);

		byte[] json =
				"[]".getBytes(
						StandardCharsets.UTF_8
				);

		MockMultipartFile file =
				new MockMultipartFile(
						"file",
						"movements.json",
						"application/json",
						json
				);

		MovementService.VerifyResult result =
				service.verifyAndPersist(
						file,
						"wrong-hash"
				);

		assertFalse(result.valid());

		assertTrue(
				result.movements().isEmpty()
		);
	}
}