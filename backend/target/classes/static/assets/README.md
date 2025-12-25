# Static Assets Directory

This directory contains static image assets that are served by Spring Boot.

## Usage

Place your static images in this directory following this structure:
- `images/` - For image files (PNG, JPG, JPEG, etc.)

## Examples

If you place a file at:
```
backend/src/main/resources/static/assets/images/virtual_showroom_project.png
```

It will be accessible via the URL:
```
/assets/images/virtual_showroom_project.png
```

And stored in the database as:
```
/assets/images/virtual_showroom_project.png
```

## Important Notes

1. These files are served from the classpath, so they are embedded in the JAR when you build the application
2. If you need to update these files, you must rebuild the application
3. For user-uploaded files that change frequently, use the `/uploads` directory instead
4. All files in this directory are publicly accessible (no authentication required)
