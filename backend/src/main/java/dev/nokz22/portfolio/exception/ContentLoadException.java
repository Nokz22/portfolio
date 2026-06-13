package dev.nokz22.portfolio.exception;

import java.io.IOException;

public class ContentLoadException extends RuntimeException {

    public ContentLoadException(String message, IOException cause) {
        super(message, cause);
    }
}
