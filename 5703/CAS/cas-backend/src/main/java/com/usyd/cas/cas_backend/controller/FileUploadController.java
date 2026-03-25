package com.usyd.cas.cas_backend.controller;

import com.usyd.cas.cas_backend.entity.Attachment;
import com.usyd.cas.cas_backend.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
public class FileUploadController {

    @Autowired
    private AttachmentService attachmentService;

    // TODO: Temporary local storage. To be replaced with Azure Blob Storage later.
    private final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Attachment> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID().toString() + extension;
            Path path = Paths.get(UPLOAD_DIR + savedFileName);
            Files.write(path, file.getBytes());

            Attachment attachment = new Attachment();
            attachment.setFileName(originalFilename);
            attachment.setFilePath(path.toAbsolutePath().toString());
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setUploadedBy(userId);
            attachment.setCreatedAt(LocalDateTime.now(ZoneOffset.UTC));

            attachmentService.save(attachment);
            return ResponseEntity.ok(attachment);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
