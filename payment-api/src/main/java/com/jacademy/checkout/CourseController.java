package com.jacademy.checkout;

import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {
    private final JdbcTemplate jdbcTemplate;

    public CourseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/checkout/courses")
    public List<Course> getCourses() {
        return jdbcTemplate.query("""
                SELECT id, subject, level, price_krw
                FROM public.courses
                ORDER BY id
                """,
                (row, index) -> new Course(
                        row.getLong("id"),
                        row.getString("subject"),
                        row.getString("level"),
                        row.getInt("price_krw")
                ));
    }

    public record Course(long id, String subject, String level, int priceKrw) {}
}
