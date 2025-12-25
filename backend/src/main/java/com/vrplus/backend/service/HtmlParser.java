package com.vrplus.backend.service;

import com.vrplus.backend.model.ContentSource;
import com.vrplus.backend.model.ContentSource.ContentBlock;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Parse HTML thành ContentSource để đồng bộ HTML Editor → Visual Editor
 */
@Component
public class HtmlParser {

    public ContentSource parse(String html) {
        if (html == null || html.trim().isEmpty()) {
            return new ContentSource(new ArrayList<>());
        }

        Document doc = Jsoup.parse(html);
        List<ContentBlock> blocks = new ArrayList<>();

        // Parse các thẻ trong article hoặc body
        Element article = doc.selectFirst("article");
        Element container = article != null ? article : doc.body();

        if (container != null) {
            for (Element element : container.children()) {
                ContentBlock block = parseElement(element);
                if (block != null) {
                    blocks.add(block);
                }
            }
        }

        return new ContentSource(blocks);
    }

    private ContentBlock parseElement(Element element) {
        String tag = element.tagName().toLowerCase();

        return switch (tag) {
            case "h1", "h2", "h3", "h4", "h5", "h6" -> parseHeading(element);
            case "p" -> parseParagraph(element);
            case "figure" -> parseImage(element);
            case "img" -> parseImageDirect(element);
            case "blockquote" -> parseQuote(element);
            case "pre" -> parseCode(element);
            case "ul", "ol" -> parseList(element);
            default -> null;
        };
    }

    private ContentBlock parseHeading(Element element) {
        ContentBlock block = new ContentBlock();
        block.setType("heading");
        block.setLevel(element.tagName().toLowerCase());
        block.setContent(element.text());
        block.setAlign(extractAlign(element));
        return block;
    }

    private ContentBlock parseParagraph(Element element) {
        ContentBlock block = new ContentBlock();
        block.setType("paragraph");
        block.setContent(element.text());
        block.setAlign(extractAlign(element));
        return block;
    }

    private ContentBlock parseImage(Element figure) {
        Element img = figure.selectFirst("img");
        if (img == null) return null;

        ContentBlock block = new ContentBlock();
        block.setType("image");
        block.setUrl(img.attr("src"));
        block.setAlt(img.attr("alt"));

        // Extract align from figure class
        String figureClass = figure.attr("class");
        if (figureClass.contains("align-center")) block.setAlign("center");
        else if (figureClass.contains("align-right")) block.setAlign("right");
        else if (figureClass.contains("align-left")) block.setAlign("left");

        return block;
    }

    private ContentBlock parseImageDirect(Element img) {
        ContentBlock block = new ContentBlock();
        block.setType("image");
        block.setUrl(img.attr("src"));
        block.setAlt(img.attr("alt"));
        block.setAlign(extractAlign(img));
        return block;
    }

    private ContentBlock parseQuote(Element blockquote) {
        ContentBlock block = new ContentBlock();
        block.setType("quote");
        block.setContent(blockquote.text());
        return block;
    }

    private ContentBlock parseCode(Element pre) {
        Element code = pre.selectFirst("code");
        String content = code != null ? code.text() : pre.text();

        ContentBlock block = new ContentBlock();
        block.setType("code");
        block.setContent(content);
        return block;
    }

    private ContentBlock parseList(Element list) {
        ContentBlock block = new ContentBlock();
        block.setType("list");

        List<String> items = new ArrayList<>();
        Elements listItems = list.select("li");
        for (Element li : listItems) {
            items.add(li.text());
        }
        block.setItems(items);

        return block;
    }

    private String extractAlign(Element element) {
        String style = element.attr("style");
        if (style.contains("text-align: center")) return "center";
        if (style.contains("text-align: right")) return "right";
        if (style.contains("text-align: left")) return "left";
        if (style.contains("text-align: justify")) return "justify";
        return null;
    }
}