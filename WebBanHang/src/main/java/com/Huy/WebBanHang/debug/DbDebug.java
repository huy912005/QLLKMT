package com.Huy.WebBanHang.debug;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.FileWriter;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DbDebug {
    private final EntityManager entityManager;

    @PostConstruct
    public void checkTables() {
        try {
            List<String> tables = entityManager
                    .createNativeQuery(
                            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
                    .getResultList();
            try (FileWriter writer = new FileWriter("db_tables.txt")) {
                writer.write("Database Tables:\n");
                for (String table : tables) {
                    writer.write(table + "\n");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
