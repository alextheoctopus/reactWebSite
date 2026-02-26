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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class BoardItemsCrudIntegrationTest extends IntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void clean() {
        jdbcTemplate.update("DELETE FROM board_items");
        jdbcTemplate.update("UPDATE board_state SET text = '', author_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = 1");
        jdbcTemplate.update("DELETE FROM users");
    }

    @Test
    void createReadUpdateDeleteFlow() throws Exception {
        String token = registerAndGetToken("timur");

        MvcResult createResult = mockMvc.perform(post("/api/board/items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"First note\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.text").value("First note"))
            .andExpect(jsonPath("$.authorName").value("Timur"))
            .andExpect(jsonPath("$.lastEditorName").value("Timur"))
            .andReturn();

        Long itemId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/board/items")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(itemId))
            .andExpect(jsonPath("$[0].text").value("First note"));

        mockMvc.perform(get("/api/board/items/" + itemId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(itemId))
            .andExpect(jsonPath("$.text").value("First note"));

        mockMvc.perform(put("/api/board/items/" + itemId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Updated note\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(itemId))
            .andExpect(jsonPath("$.text").value("Updated note"));

        mockMvc.perform(delete("/api/board/items/" + itemId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/board/items/" + itemId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNotFound());
    }

    @Test
    void getMissingItemReturnsNotFound() throws Exception {
        String token = registerAndGetToken("timur");

        mockMvc.perform(get("/api/board/items/99999")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isNotFound());
    }

    @Test
    void updateByAnotherUserUpdatesLastEditor() throws Exception {
        String ownerToken = registerAndGetToken("timur");
        String secondToken = registerAndGetToken("alex");

        MvcResult createResult = mockMvc.perform(post("/api/board/items")
                .header("Authorization", "Bearer " + ownerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Owner item\"}"))
            .andExpect(status().isCreated())
            .andReturn();

        Long itemId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(put("/api/board/items/" + itemId)
                .header("Authorization", "Bearer " + secondToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Hack\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.authorName").value("Timur"))
            .andExpect(jsonPath("$.lastEditorName").value("Alex"))
            .andExpect(jsonPath("$.text").value("Hack"));
    }

    private String registerAndGetToken(String login) throws Exception {
        String payload = """
            {
              "name": "%s",
              "login": "%s",
              "password": "secret123"
            }
            """.formatted(Character.toUpperCase(login.charAt(0)) + login.substring(1), login);

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
            .andExpect(status().isOk())
            .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        return jsonNode.get("token").asText();
    }
}
