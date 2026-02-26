package com.devops.board.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class BoardFlowIntegrationTest extends IntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void clean() {
        jdbcTemplate.update("UPDATE board_state SET text = '', author_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = 1");
        jdbcTemplate.update("DELETE FROM users");
    }

    @Test
    void boardUpdateAndReadFlow() throws Exception {
        String token = registerAndGetToken();

        String updatePayload = """
            {
              \"text\": \"Shared board text\"
            }
            """;

        mockMvc.perform(put("/api/board")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatePayload))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.text").value("Shared board text"))
            .andExpect(jsonPath("$.authorName").value("Timur"));

        mockMvc.perform(get("/api/board")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.text").value("Shared board text"))
            .andExpect(jsonPath("$.authorName").value("Timur"));
    }

    @Test
    void updateBoardWithoutTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(put("/api/board")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"abc\"}"))
            .andExpect(status().isUnauthorized());
    }

    private String registerAndGetToken() throws Exception {
        String payload = """
            {
              \"name\": \"Timur\",
              \"login\": \"timur\",
              \"password\": \"secret123\"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("token").asText();
    }
}
