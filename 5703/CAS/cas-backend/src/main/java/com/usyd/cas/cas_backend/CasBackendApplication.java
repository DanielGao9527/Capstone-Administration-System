package com.usyd.cas.cas_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.usyd.cas.cas_backend.mapper")
public class CasBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CasBackendApplication.class, args);
	}

}
