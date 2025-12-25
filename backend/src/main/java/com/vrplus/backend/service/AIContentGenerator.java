package com.vrplus.backend.service;

import com.vrplus.backend.model.ContentSource;
import com.vrplus.backend.model.ContentSource.ContentBlock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

public interface AIContentGenerator {
    ContentSource generateDraft(String rawInput, String tone);
}