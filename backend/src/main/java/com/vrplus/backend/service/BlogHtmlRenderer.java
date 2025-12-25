package com.vrplus.backend.service;

import com.vrplus.backend.model.ContentSource;
import com.vrplus.backend.model.ContentSource.ContentBlock;
import org.springframework.stereotype.Component;
import org.apache.commons.text.StringEscapeUtils;

/**
 * Render HTML từ ContentSource
 * KHÔNG dùng AI để sinh HTML
 */
@Component
public class BlogHtmlRenderer {

    public String render(ContentSource source) {
        if (source == null || source.getBlocks() == null) {
            return "";
        }

        StringBuilder html = new StringBuilder();
        html.append("<article class=\"blog-content\">\n");

        for (ContentBlock block : source.getBlocks()) {
            html.append(renderBlock(block));
        }

        html.append("</article>");
        return html.toString();
    }

    private String renderBlock(ContentBlock block) {
        if (block == null || block.getType() == null) {
            return "";
        }

        String align = block.getAlign() != null ? " style=\"text-align: " + escapeHtml(block.getAlign()) + ";\"" : "";

        return switch (block.getType().toLowerCase()) {
            case "heading" -> renderHeading(block, align);
            case "paragraph" -> renderParagraph(block, align);
            case "image" -> renderImage(block);
            case "link" -> renderLink(block);
            case "list" -> renderList(block);
            case "quote" -> renderQuote(block);
            case "code" -> renderCode(block);
            default -> "";
        };
    }

    private String renderHeading(ContentBlock block, String align) {
        String level = block.getLevel() != null ? block.getLevel() : "h2";
        String content = escapeHtml(block.getContent());
        return String.format("<%s%s>%s</%s>\n", level, align, content, level);
    }

    private String renderParagraph(ContentBlock block, String align) {
        String content = escapeHtml(block.getContent());
        return String.format("<p%s>%s</p>\n", align, content);
    }

    private String renderImage(ContentBlock block) {
        String url = escapeHtml(block.getUrl());
        String alt = escapeHtml(block.getAlt() != null ? block.getAlt() : "");
        String align = block.getAlign() != null ? " class=\"align-" + escapeHtml(block.getAlign()) + "\"" : "";
        return String.format("<figure%s>\n  <img src=\"%s\" alt=\"%s\" loading=\"lazy\">\n</figure>\n",
                align, url, alt);
    }

    private String renderLink(ContentBlock block) {
        String url = escapeHtml(block.getUrl());
        String content = escapeHtml(block.getContent());
        return String.format("<a href=\"%s\" target=\"_blank\" rel=\"noopener noreferrer\">%s</a>",
                url, content);
    }

    private String renderList(ContentBlock block) {
        if (block.getItems() == null || block.getItems().isEmpty()) {
            return "";
        }

        StringBuilder html = new StringBuilder("<ul>\n");
        for (String item : block.getItems()) {
            html.append("  <li>").append(escapeHtml(item)).append("</li>\n");
        }
        html.append("</ul>\n");
        return html.toString();
    }

    private String renderQuote(ContentBlock block) {
        String content = escapeHtml(block.getContent());
        return String.format("<blockquote>\n  <p>%s</p>\n</blockquote>\n", content);
    }

    private String renderCode(ContentBlock block) {
        String content = escapeHtml(block.getContent());
        return String.format("<pre><code>%s</code></pre>\n", content);
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return StringEscapeUtils.escapeHtml4(text);
    }
}