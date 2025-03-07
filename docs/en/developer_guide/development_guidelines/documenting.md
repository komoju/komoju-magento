# Documenting KOMOJU for Magento

## Overview
This document provides guidelines on how to document the KOMOJU for Magento plugin effectively. Documentation should be clear, concise, and structured for both developers and users to understand easily.

## Structure
Documentation is maintained using **mkdocs-material** and supports multiple languages (English and Japanese). The documents are organized under:
- **User Guide** for installation and usage instructions.
- **Developer Guide** for setup, development, and integration details.

## Running the Documentation Locally with Docker
To preview documentation changes before deploying, use Docker to serve the documentation:

```sh
docker-compose -f compose.yaml up -d docs
```

This serves the documentation locally at `http://127.0.0.1:5555/`.

Alternatively, you can run the following command manually inside the `docs` container:

```sh
docker run --rm -v $(pwd):/docs -p 5555:5555 mkdocs serve --dev-addr=0.0.0.0:5555
```

## Deployment
Currently, GitHub Actions is not set up for automatic deployment. You can deploy manually using **GitHub Pages** with your Personal Access Token (PAT):

```sh
mkdocs gh-deploy --force
```

## Writing Documentation
- **Location:**
  - English documentation: `docs/en/`
  - Japanese documentation: `docs/ja/`
- **Format:** Use **Markdown** (`.md`) files.
- **File Naming:** Use lowercase words separated by underscores (e.g., `getting_started.md`).
- **Headings:** Use meaningful and structured headings (`#`, `##`, `###`).
- **Code Blocks:** Use fenced code blocks (```) for command-line instructions and code snippets.
- **Links:** Use relative paths for linking to other documentation pages.
- **Images:** Store images in `docs/assets/` and use relative links to reference them.

## Translation Guidelines
To maintain consistency in translations:
- Use the `nav_translations` field in `mkdocs.yml` to map navigation items.
- Ensure both English and Japanese documents are updated together.

## Contribution
To contribute to the documentation:

1. Fork the repository: [degica/komoju-magento](https://github.com/degica/komoju-magento)

2. Create a new branch

3. Update the relevant `.md` files

4. Submit a Pull Request

For any questions, refer to the repository README or open an issue.